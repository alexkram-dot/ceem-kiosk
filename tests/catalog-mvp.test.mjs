import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const records = JSON.parse(await readFile(path.join(root, "app/catalog.generated.json"), "utf8"));
const catalogSource = await readFile(path.join(root, "app/catalog-data.ts"), "utf8");
const kioskSource = await readFile(path.join(root, "app/kiosk.tsx"), "utf8");

const featuredIds = [
  "b-205", "b-148", "b-053", "b-052", "b-209", "b-211", "b-168", "b-084", "b-076", "b-062",
  "b-001", "b-088", "b-037", "b-031", "b-002", "b-016", "b-006", "b-155", "b-048",
  "ac-026", "ac-035", "ac-108",
  "y-041", "y-070", "y-147", "b-204", "f-073", "f-005", "y-187", "f-206",
];

const imageIds = ["b-205", "b-148", "b-053", "b-052", "b-209", "b-211", "b-168", "b-084", "b-204", "ac-026", "y-041", "f-073", "y-187"];

test("catalog contains unique direct CEEM strain records", () => {
  assert.equal(records.length, 255);
  assert.equal(new Set(records.map((record) => record.registry)).size, records.length);
  assert.equal(new Set(records.map((record) => record.url)).size, records.length);
  for (const record of records) {
    assert.match(record.url, /^https:\/\/mb\.kubsau\.ru\/catalog\/(?:bakterii|griby|aktinomitsety)\/.+\/ceem-[^/]+\/$/);
  }
});

test("the MVP selection contains exactly 30 known records", () => {
  assert.equal(featuredIds.length, 30);
  const knownIds = new Set(records.map((record) => record.id));
  for (const id of featuredIds) {
    assert.ok(knownIds.has(id), `Missing featured record: ${id}`);
    assert.match(catalogSource, new RegExp(`\\"${id}\\"`));
  }
});

test("available visuals are optimized and the gallery is removed", async () => {
  for (const id of imageIds) {
    await access(path.join(root, `public/images/strains/${id}.webp`));
  }
  assert.doesNotMatch(kioskSource, /gallery/i);
  assert.doesNotMatch(kioskSource, /Визуализац|visualization/i);
  assert.match(kioskSource, /href=\{strain\.url\}/);
});

test("catalog pagination keeps six strains beside the selected record", () => {
  assert.match(kioskSource, /CATALOG_PAGE_SIZE = 6/);
  assert.match(kioskSource, /visibleStrains = filtered\.slice/);
  assert.match(kioskSource, /onSelect=\{setSelected\}/);
});

test("strain accents consistently represent taxonomy", () => {
  assert.match(catalogSource, /bacteria: "cyan"/);
  assert.match(catalogSource, /actinomycetes: "amber"/);
  assert.match(catalogSource, /fungi: "magenta"/);
  assert.match(catalogSource, /accent: categoryAccents\[category\]/);
  assert.doesNotMatch(catalogSource, /accentCycle/);
});

test("internal featured selection is not exposed as a demo label", () => {
  assert.doesNotMatch(kioskSource, /Демо|Выбрано для демонстрации|Featured in the showcase|30 featured strains/);
});

test("catalog cards have no decorative chevron and product fallback is neutral", () => {
  assert.doesNotMatch(kioskSource, /className="strain-chevron"/);
  assert.match(kioskSource, /Данные о продуктах не представлены\./);
  assert.match(kioskSource, /Product data are not provided\./);
});
