#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const origin = "https://mb.kubsau.ru";
const categories = [
  { slug: "bakterii", id: "bacteria" },
  { slug: "griby", id: "fungi" },
  { slug: "aktinomitsety", id: "actinomycetes" },
];

const strip = (value) => value
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, " ")
  .trim();

const links = (html, base) => [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
  .map((match) => ({ url: new URL(match[1], base).href, text: strip(match[2]) }));

const unique = (items) => [...new Map(items.map((item) => [item.url, item])).values()];

async function get(url, attempt = 1) {
  try {
    const response = await fetch(url, { headers: { "user-agent": "CEEM-MVP-catalog-sync/1.0" } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } catch (error) {
    if (attempt >= 3) throw new Error(`Failed ${url}: ${error.message}`);
    await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
    return get(url, attempt + 1);
  }
}

async function mapLimit(items, limit, worker) {
  const result = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      result[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return result;
}

function parseRows(html) {
  const rows = {};
  for (const match of html.matchAll(/<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi)) {
    rows[strip(match[1])] = strip(match[2]);
  }
  return rows;
}

async function scrapeCategory(category) {
  const root = `${origin}/catalog/${category.slug}/`;
  const rootHtml = await get(root);
  const genusPattern = new RegExp(`^${origin}/catalog/${category.slug}/[^/]+/$`);
  const genusLinks = unique(links(rootHtml, root).filter((item) => genusPattern.test(item.url)));

  const speciesGroups = await mapLimit(genusLinks, 8, async (genus) => {
    const html = await get(genus.url);
    const speciesPattern = new RegExp(`^${origin}/catalog/${category.slug}/[^/]+/[^/]+/$`);
    return unique(links(html, genus.url).filter((item) => speciesPattern.test(item.url)));
  });
  const speciesLinks = unique(speciesGroups.flat());

  const strainGroups = await mapLimit(speciesLinks, 8, async (species) => {
    const html = await get(species.url);
    const strainPattern = new RegExp(`^${origin}/catalog/${category.slug}/[^/]+/[^/]+/ceem-[^/]+/$`, "i");
    return unique(links(html, species.url).filter((item) => strainPattern.test(item.url)));
  });
  const strainLinks = unique(strainGroups.flat());

  return mapLimit(strainLinks, 8, async (strain) => {
    const html = await get(strain.url);
    const row = parseRows(html);
    const registry = row["Номер реестра КубГАУ"] || strain.text.match(/\((CEEM[^)]+)\)/i)?.[1] || "";
    const name = (row["Вид"] || strain.text).replace(/\s*\(CEEM[^)]+\)\s*$/i, "").trim();
    const temp = row["Оптимальная температура роста"]?.match(/от\s*([^ ]+)\s*до\s*([^ ]+)/i);
    return {
      id: registry.toLowerCase().replace(/^ceem\s+/i, "").replace(/[^a-z0-9]+/g, "-"),
      name,
      registry,
      category: category.id,
      genus: row["Род"] || "",
      species: row["Наименование"] || "",
      originRu: row["Родословная штамма и способ его получения"] || "Не указано в открытой карточке",
      temperatureRu: temp ? `${temp[1]}–${temp[2]} °C` : "Не указана",
      applicationRu: row["Применение"] || "",
      productsRu: row["Производимый продукт"] ? row["Производимый продукт"].split(/\s*,\s*/).filter(Boolean) : [],
      url: strain.url,
    };
  });
}

const rawCatalog = (await mapLimit(categories, 3, scrapeCategory)).flat();
const catalog = [...new Map(rawCatalog.map((item) => [item.registry || item.url, item])).values()];
catalog.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name) || a.registry.localeCompare(b.registry));

await writeFile(new URL("../app/catalog.generated.json", import.meta.url), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Saved ${catalog.length} records: ${categories.map((category) => `${category.id}=${catalog.filter((item) => item.category === category.id).length}`).join(", ")}`);
