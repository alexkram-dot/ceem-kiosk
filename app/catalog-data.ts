import catalogRecords from "./catalog.generated.json";

export type Category = "all" | "bacteria" | "fungi" | "actinomycetes";
export type Evidence = "confirmed" | "potential";
export type ApplicationId = "all" | "plant-nutrition" | "plant-protection" | "pest-control" | "animal-health" | "food" | "industrial" | "diagnostics" | "bioconversion";
export type TraitId = "plant-growth" | "antagonism" | "lipopeptides" | "probiotic" | "diagnostic-model" | "reference" | "pest-control" | "bacteriocins" | "lactic-acid" | "biotransformation";
export type Localized = { ru: string; en: string };
export type TaggedItem<T extends string> = { id: T; evidence: Evidence };

export type Strain = {
  id: string;
  name: string;
  registry: string;
  category: Exclude<Category, "all">;
  image?: string;
  featured: boolean;
  origin: Localized;
  temperature: Localized;
  role: Localized;
  products: Localized[];
  description: Localized;
  applications: TaggedItem<Exclude<ApplicationId, "all">>[];
  traits: TaggedItem<TraitId>[];
  accent: "cyan" | "green" | "amber" | "magenta";
  url: string;
};

const l = (ru: string, en: string): Localized => ({ ru, en });

export const featuredOrder = [
  "b-205", "b-148", "b-053", "b-052", "b-209", "b-211", "b-168", "b-084", "b-076", "b-062",
  "b-001", "b-088", "b-037", "b-031", "b-002", "b-016", "b-006", "b-155", "b-048",
  "ac-026", "ac-035", "ac-108",
  "y-041", "y-070", "y-147", "b-204", "f-073", "f-005", "y-187", "f-206",
] as const;

const featuredIds = new Set<string>(featuredOrder);
const imageIds = new Set(["b-205", "b-148", "b-053", "b-052", "b-209", "b-211", "b-168", "b-084", "b-204", "ac-026", "y-041", "f-073", "y-187"]);

const originEn: Record<string, string> = {
  "b-205": "VKPM B-9295, DSMZ 281", "b-148": "VKPM B-11094", "b-053": "Isolated from the soybean rhizosphere", "b-052": "Isolated from the pea rhizosphere",
  "b-209": "Soil", "b-211": "Soil", "b-168": "Not specified in the public record", "b-084": "Isolated from a plant leaf surface", "b-076": "Isolated from affected cabbage",
  "b-062": "Honey bee intestine", "b-001": "Sauerkraut", "b-088": "Isolated from cheese", "b-037": "VKPM B-5788", "b-031": "Isolated from the sturgeon intestine",
  "b-002": "Probiotic culture", "b-016": "Isolated from sour cream", "b-006": "Grape wine material", "b-155": "Isolated from grapevine galls", "b-048": "VKPM B-6720",
  "ac-026": "VKPM AC-1248", "ac-035": "Isolated from a recirculating aquaculture system", "ac-108": "Not specified in the public record",
  "y-041": "Isolated from a bread starter", "y-070": "Isolated from dairy products", "y-147": "VKPM Y-3153", "b-204": "Soil", "f-073": "Not specified in the public record",
  "f-005": "Isolated from soy sauce, China", "y-187": "Isolated in forest ecosystems of Krasnodar Krai", "f-206": "Tree trunk",
};

const productsEn: Record<string, string> = {
  "полисахариды": "Polysaccharides", "биополимеры": "Biopolymers", "итурин": "Iturin", "сурфактин": "Surfactin", "лепидоцид": "Lepidocide",
  "молочная кислота": "Lactic acid", "бактериоцины": "Bacteriocins", "уксусная кислота": "Acetic acid", "липаза": "Lipase",
  "амилолитические ферменты": "Amylolytic enzymes", "продуцент плодовых тел": "Fruiting-body producer",
};

const demoApplications: Record<string, Exclude<ApplicationId, "all">[]> = {
  "b-205": ["plant-nutrition", "industrial"], "b-148": ["plant-nutrition"], "b-053": ["plant-nutrition", "diagnostics"], "b-052": ["plant-nutrition"],
  "b-209": ["plant-protection", "industrial"], "b-211": ["plant-protection", "industrial"], "b-168": ["pest-control", "industrial"],
  "b-084": ["plant-protection", "diagnostics"], "b-076": ["diagnostics"], "b-062": ["animal-health"],
  "b-001": ["food", "industrial"], "b-088": ["food"], "b-037": ["food"], "b-031": ["food", "industrial"], "b-002": ["animal-health", "food", "industrial"],
  "b-016": ["food", "industrial"], "b-006": ["food", "industrial"], "b-155": ["diagnostics", "plant-protection"], "b-048": ["diagnostics", "industrial"],
  "ac-026": ["animal-health", "food", "industrial"], "ac-035": ["industrial"], "ac-108": ["diagnostics"],
  "y-041": ["food"], "y-070": ["food", "diagnostics"], "y-147": ["industrial"], "b-204": ["plant-protection", "bioconversion"],
  "f-073": ["pest-control", "diagnostics"], "f-005": ["food", "industrial"], "y-187": ["industrial", "bioconversion"], "f-206": ["bioconversion"],
};

const confirmedApplications: Record<string, Exclude<ApplicationId, "all">[]> = {
  "b-205": ["industrial"], "b-053": ["plant-nutrition", "diagnostics"], "b-209": ["industrial"], "b-211": ["industrial"], "b-168": ["pest-control", "industrial"],
  "b-084": ["diagnostics"], "b-076": ["diagnostics"], "b-062": ["animal-health"], "b-001": ["industrial"], "b-037": ["food"], "b-031": ["industrial"],
  "b-002": ["animal-health", "industrial"], "b-016": ["industrial"], "b-006": ["industrial"], "b-048": ["industrial"], "ac-026": ["industrial"],
  "y-070": ["diagnostics"], "y-147": ["industrial"], "f-073": ["diagnostics"], "f-005": ["industrial"], "y-187": ["industrial"],
};

const demoTraits: Record<string, TraitId[]> = {
  "b-205": ["plant-growth"], "b-148": ["plant-growth"], "b-053": ["plant-growth", "reference"], "b-052": ["plant-growth"],
  "b-209": ["antagonism", "lipopeptides"], "b-211": ["antagonism", "lipopeptides"], "b-168": ["pest-control"], "b-084": ["antagonism", "reference"],
  "b-076": ["reference"], "b-062": ["probiotic"], "b-001": ["lactic-acid"], "b-088": ["probiotic"], "b-037": ["lactic-acid"], "b-031": ["lactic-acid"],
  "b-002": ["probiotic", "bacteriocins"], "b-016": ["lactic-acid"], "b-006": ["biotransformation"], "b-155": ["diagnostic-model"], "b-048": ["diagnostic-model"],
  "ac-026": ["probiotic", "bacteriocins", "lactic-acid"], "ac-035": ["biotransformation"], "ac-108": ["reference"], "y-041": ["biotransformation"],
  "y-070": ["reference", "biotransformation"], "y-147": ["biotransformation"], "b-204": ["antagonism", "biotransformation"], "f-073": ["pest-control", "reference"],
  "f-005": ["biotransformation"], "y-187": ["biotransformation"], "f-206": ["biotransformation"],
};

const confirmedTraits = new Set([
  "b-053:reference", "b-209:lipopeptides", "b-211:lipopeptides", "b-168:pest-control", "b-084:reference", "b-076:reference", "b-062:probiotic",
  "b-001:lactic-acid", "b-037:lactic-acid", "b-031:lactic-acid", "b-002:probiotic", "b-002:bacteriocins", "b-016:lactic-acid",
  "ac-026:bacteriocins", "ac-026:lactic-acid", "y-070:reference", "f-073:reference",
]);

function inferredApplications(application: string): Exclude<ApplicationId, "all">[] {
  const value = application.toLowerCase();
  const result: Exclude<ApplicationId, "all">[] = [];
  if (value.includes("биоудобр")) result.push("plant-nutrition");
  if (value.includes("биопестиц")) result.push("pest-control");
  if (value.includes("пробиот")) result.push("animal-health");
  if (value.includes("пищев")) result.push("food");
  if (value.includes("биопродуцент")) result.push("industrial");
  if (value.includes("референс")) result.push("diagnostics");
  return result;
}

function roleFor(applications: Exclude<ApplicationId, "all">[], hasProducts: boolean): Localized {
  if (applications.includes("plant-nutrition")) return l("Культура для агробиотехнологий", "Agricultural biotechnology culture");
  if (applications.includes("plant-protection")) return l("Культура для защиты растений", "Plant protection culture");
  if (applications.includes("pest-control")) return l("Культура для биоконтроля", "Biocontrol culture");
  if (applications.includes("animal-health")) return l("Пробиотическая культура", "Probiotic culture");
  if (applications.includes("food")) return l("Ферментационная культура", "Fermentation culture");
  if (applications.includes("diagnostics")) return l("Референсная культура", "Reference culture");
  if (hasProducts || applications.includes("industrial")) return l("Биопродуцент", "Bioproduct producer");
  if (applications.includes("bioconversion")) return l("Культура для биоконверсии", "Bioconversion culture");
  return l("Коллекционный штамм", "Collection strain");
}

const accentCycle: Strain["accent"][] = ["cyan", "green", "amber", "magenta"];

export const strains: Strain[] = catalogRecords.map((record, index) => {
  const featured = featuredIds.has(record.id);
  const applicationIds = featured ? demoApplications[record.id] : inferredApplications(record.applicationRu);
  const applications = applicationIds.map((id) => ({
    id,
    evidence: (confirmedApplications[record.id]?.includes(id) || (!featured && applicationIds.includes(id))) ? "confirmed" as const : "potential" as const,
  }));
  const products = record.productsRu.filter((item) => item !== "-").map((item) => l(item, productsEn[item.toLowerCase()] || "See source record"));
  const traits = (featured ? demoTraits[record.id] || [] : []).map((id) => ({ id, evidence: confirmedTraits.has(`${record.id}:${id}`) ? "confirmed" as const : "potential" as const }));
  const role = roleFor(applicationIds, products.length > 0);
  const sourceRu = record.originRu === "Не указано в открытой карточке" ? record.originRu : `Источник: ${record.originRu}`;
  const factsRu = [record.applicationRu ? `Применение в каталоге: ${record.applicationRu}.` : "", products.length ? `Указанные продукты: ${products.map((item) => item.ru).join(", ")}.` : ""].filter(Boolean).join(" ");
  const description = featured
    ? l(`Один из 30 штаммов демонстрационной подборки. ${sourceRu}. ${factsRu}`.replace(/\s+/g, " ").trim(), `One of 30 strains selected for the MVP showcase. Source: ${originEn[record.id] || "see the source record"}. ${products.length ? `Reported products: ${products.map((item) => item.en).join(", ")}.` : ""}`.trim())
    : l(`Штамм ${record.name} представлен в открытом каталоге КЭЭМ. ${sourceRu}. ${factsRu}`.replace(/\s+/g, " ").trim(), `The ${record.name} strain is listed in the public CEEM catalogue. Detailed source data are available in the original record.`);
  return {
    id: record.id,
    name: record.name,
    registry: record.registry,
    category: record.category as Exclude<Category, "all">,
    image: imageIds.has(record.id) ? `/images/strains/${record.id}.webp` : undefined,
    featured,
    origin: l(record.originRu, originEn[record.id] || "See the Russian-language source record"),
    temperature: l(record.temperatureRu, record.temperatureRu),
    role,
    products,
    description,
    applications,
    traits,
    accent: accentCycle[index % accentCycle.length],
    url: record.url,
  };
}).sort((a, b) => {
  const aIndex = featuredOrder.indexOf(a.id as typeof featuredOrder[number]);
  const bIndex = featuredOrder.indexOf(b.id as typeof featuredOrder[number]);
  if (aIndex >= 0 || bIndex >= 0) return (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex);
  return a.category.localeCompare(b.category) || a.name.localeCompare(b.name) || a.registry.localeCompare(b.registry);
});

export const catalogCounts = {
  all: strains.length,
  bacteria: strains.filter((strain) => strain.category === "bacteria").length,
  fungi: strains.filter((strain) => strain.category === "fungi").length,
  actinomycetes: strains.filter((strain) => strain.category === "actinomycetes").length,
};
