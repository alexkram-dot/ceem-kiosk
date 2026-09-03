"use client";

import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Beaker, BookOpen, Box, Bug, ChevronLeft, ChevronRight, Dna, Factory,
  FlaskConical, Globe2, HeartPulse, Info, Layers3, MapPin, Microscope,
  ScanSearch, Search, ShieldCheck, Sparkles, Sprout, Thermometer, Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Lang = "ru" | "en";
type View = "catalog" | "process" | "about";
type Category = "all" | "bacteria" | "fungi" | "actinomycetes";
type BrowseMode = "applications" | "taxonomy";
type Evidence = "confirmed" | "potential";
type ApplicationId = "all" | "plant-nutrition" | "plant-protection" | "pest-control" | "animal-health" | "food" | "industrial" | "diagnostics" | "bioconversion";
type TraitId = "plant-growth" | "antagonism" | "lipopeptides" | "probiotic" | "diagnostic-model" | "reference" | "pest-control" | "bacteriocins" | "lactic-acid" | "biotransformation";
type Localized = { ru: string; en: string };
type TaggedItem<T extends string> = { id: T; evidence: Evidence };

type Strain = {
  id: string;
  name: string;
  registry: string;
  category: Exclude<Category, "all">;
  image: string;
  images?: string[];
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
const tx = (value: Localized, lang: Lang) => value[lang];

/* Абсолютные пути Sites становятся путями /ceem-kiosk/... в GitHub Pages. */
const publicAsset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
const visualAssets = {
  bacillus: publicAsset("/images/bacillus-subtilis-visualization.png"),
  bifidobacterium: publicAsset("/images/bifidobacterium-animalis-visualization.png"),
  trichoderma: publicAsset("/images/trichoderma-viride-visualization.png"),
};

/*
 * Временный набор из трёх разных визуализаций позволяет проверить листание.
 * После появления реальных снимков массивы images будут заменены без изменения галереи.
 */
const demoVisuals = [
  visualAssets.bacillus,
  visualAssets.bifidobacterium,
  visualAssets.trichoderma,
];
const demoGallery = (primary: string) => [primary, ...demoVisuals.filter((image) => image !== primary)];

/*
 * В демонстрационной выборке используются только микроорганизмы с сайта КЭЭМ.
 * У прикладных тегов отдельно хранится уровень доказательности, чтобы свойства
 * конкретного штамма не смешивались с направлениями будущих исследований.
 */
const strains: Strain[] = [
  {
    id: "b-209", name: "Bacillus subtilis", registry: "CEEM B-209", category: "bacteria",
    image: visualAssets.bacillus, origin: l("Почва", "Soil"), temperature: l("28–30 °C", "28–30 °C"),
    images: demoGallery(visualAssets.bacillus),
    role: l("Биопродуцент", "Bioproduct producer"), products: [l("Итурин", "Iturin"), l("Сурфактин", "Surfactin")],
    description: l("Почвенный штамм из коллекции КЭЭМ. В открытой карточке отмечена способность продуцировать итурин и сурфактин.", "A soil strain from the CEEM collection. Its public record reports production of iturin and surfactin."),
    applications: [{ id: "plant-nutrition", evidence: "potential" }, { id: "plant-protection", evidence: "potential" }, { id: "industrial", evidence: "confirmed" }],
    traits: [{ id: "plant-growth", evidence: "potential" }, { id: "antagonism", evidence: "potential" }, { id: "lipopeptides", evidence: "confirmed" }],
    accent: "cyan", url: "https://mb.kubsau.ru/catalog/bakterii/bacillus/subtilis/ceem-b-209/",
  },
  {
    id: "b-211", name: "Bacillus velezensis", registry: "CEEM B-211", category: "bacteria",
    image: visualAssets.bacillus, origin: l("Почва", "Soil"), temperature: l("28–30 °C", "28–30 °C"),
    images: demoGallery(visualAssets.bacillus),
    role: l("Носитель генов биосинтеза", "Carrier of biosynthesis genes"), products: [l("Гены биосинтеза итурина", "Iturin biosynthesis genes"), l("Гены биосинтеза сурфактина", "Surfactin biosynthesis genes")],
    description: l("Почвенный штамм с генетическим потенциалом к биосинтезу итурина и сурфактина.", "A soil-derived strain with genetic potential for iturin and surfactin biosynthesis."),
    applications: [{ id: "plant-nutrition", evidence: "potential" }, { id: "plant-protection", evidence: "potential" }, { id: "industrial", evidence: "potential" }],
    traits: [{ id: "plant-growth", evidence: "potential" }, { id: "antagonism", evidence: "potential" }, { id: "lipopeptides", evidence: "potential" }],
    accent: "amber", url: "https://mb.kubsau.ru/catalog/bakterii/bacillus/velezensis/ceem-b-211/",
  },
  {
    id: "b-114", name: "Bacillus amyloliquefaciens", registry: "CEEM B-114", category: "bacteria",
    image: visualAssets.bacillus, origin: l("Референсная культура", "Reference culture"), temperature: l("28–30 °C", "28–30 °C"),
    role: l("Референсный штамм", "Reference strain"), products: [],
    description: l("Референсная культура из публичного каталога КЭЭМ для исследовательских и сравнительных работ.", "A reference culture in the public CEEM catalogue for research and comparative studies."),
    applications: [{ id: "diagnostics", evidence: "confirmed" }, { id: "industrial", evidence: "potential" }],
    traits: [{ id: "reference", evidence: "confirmed" }, { id: "lipopeptides", evidence: "potential" }],
    accent: "green", url: "https://mb.kubsau.ru/catalog/bakterii/bacillus/amyloliquefaciens/ceem-b-114/",
  },
  {
    id: "b-062", name: "Apilactobacillus kunkeei", registry: "CEEM B-062", category: "bacteria",
    image: visualAssets.bifidobacterium, origin: l("Кишечный канал пчелы", "Honey bee intestinal tract"), temperature: l("Уточняется", "Under study"),
    images: demoGallery(visualAssets.bifidobacterium),
    role: l("Перспективный пробиотический штамм", "Candidate probiotic strain"), products: [l("Пробиотическая культура", "Probiotic culture")],
    description: l("Автохтонный микроорганизм, выделенный от пчёл карпатской породы. Изучены биохимические и антагонистические свойства, выполнено полногеномное секвенирование.", "An autochthonous microorganism isolated from Carpathian honey bees. Its biochemical and antagonistic properties were studied and whole-genome sequencing was completed."),
    applications: [{ id: "animal-health", evidence: "potential" }, { id: "plant-protection", evidence: "potential" }],
    traits: [{ id: "probiotic", evidence: "potential" }, { id: "antagonism", evidence: "confirmed" }],
    accent: "magenta", url: "https://mb.kubsau.ru/",
  },
  {
    id: "b-155", name: "Allorhizobium vitis", registry: "CEEM B-155", category: "bacteria",
    image: visualAssets.bacillus, origin: l("Корончатые галлы винограда", "Crown galls of grapevine"), temperature: l("Уточняется", "Under study"),
    role: l("Фитопатологические исследования", "Phytopathology research"), products: [l("Диагностическая модель", "Diagnostic model")],
    description: l("Возбудитель бактериального рака винограда, выделенный в Краснодарском крае. Представляет интерес для диагностики и фитопатологических исследований.", "A grapevine crown gall pathogen isolated in Krasnodar Krai. It is a resource for diagnostics and phytopathology research."),
    applications: [{ id: "diagnostics", evidence: "confirmed" }, { id: "plant-protection", evidence: "potential" }],
    traits: [{ id: "diagnostic-model", evidence: "confirmed" }],
    accent: "green", url: "https://mb.kubsau.ru/",
  },
  {
    id: "f-204", name: "Trichoderma viride", registry: "CEEM B-204", category: "fungi",
    image: visualAssets.trichoderma, origin: l("Почва", "Soil"), temperature: l("27–29 °C", "27–29 °C"),
    images: demoGallery(visualAssets.trichoderma),
    role: l("Коллекционный штамм", "Collection strain"), products: [],
    description: l("Почвенный микроскопический гриб из фонда КЭЭМ. Открытая карточка подтверждает происхождение и параметры культивирования.", "A soil-derived microscopic fungus in the CEEM holdings. Its public record confirms origin and cultivation parameters."),
    applications: [{ id: "plant-protection", evidence: "potential" }], traits: [{ id: "antagonism", evidence: "potential" }],
    accent: "green", url: "https://mb.kubsau.ru/catalog/griby/trichoderma/viride/ceem-b-204/",
  },
  {
    id: "f-206", name: "Hericium erinaceus", registry: "CEEM F-206", category: "fungi",
    image: visualAssets.trichoderma, origin: l("Ствол дерева", "Tree trunk"), temperature: l("25–28 °C", "25–28 °C"),
    role: l("Базидиальный гриб", "Basidiomycete fungus"), products: [],
    description: l("Базидиальный гриб, выделенный со ствола дерева и сохранённый в коллекции КЭЭМ.", "A basidiomycete fungus isolated from a tree trunk and preserved in the CEEM collection."),
    applications: [{ id: "bioconversion", evidence: "potential" }], traits: [{ id: "biotransformation", evidence: "potential" }],
    accent: "amber", url: "https://mb.kubsau.ru/catalog/griby/hericium/erinaceus/ceem-f-206/",
  },
  {
    id: "f-073", name: "Metarhizium anisopliae var. anisopliae", registry: "CEEM F-073", category: "fungi",
    image: visualAssets.trichoderma, origin: l("Референсная культура", "Reference culture"), temperature: l("28–30 °C", "28–30 °C"),
    role: l("Референсный штамм", "Reference strain"), products: [],
    description: l("Референсная культура гриба, представленная в публичном каталоге КЭЭМ.", "A fungal reference culture listed in the public CEEM catalogue."),
    applications: [{ id: "pest-control", evidence: "potential" }, { id: "diagnostics", evidence: "confirmed" }],
    traits: [{ id: "pest-control", evidence: "potential" }, { id: "reference", evidence: "confirmed" }],
    accent: "cyan", url: "https://mb.kubsau.ru/catalog/griby/metarhizium/anisopliae-var-anisopliae/ceem-f-073/",
  },
  {
    id: "ac-026", name: "Bifidobacterium animalis", registry: "CEEM AC-026", category: "actinomycetes",
    image: visualAssets.bifidobacterium, origin: l("ВКПМ АС-1248", "VKPM AC-1248"), temperature: l("35–37 °C", "35–37 °C"),
    role: l("Биопродуцент", "Bioproduct producer"), products: [l("Бактериоцины", "Bacteriocins"), l("Молочная кислота", "Lactic acid")],
    description: l("Штамм из раздела актиномицетов. В открытом каталоге указано производство бактериоцинов и молочной кислоты.", "A strain listed in the actinomycete section. Its public record reports production of bacteriocins and lactic acid."),
    applications: [{ id: "animal-health", evidence: "potential" }, { id: "food", evidence: "potential" }, { id: "industrial", evidence: "confirmed" }],
    traits: [{ id: "probiotic", evidence: "potential" }, { id: "bacteriocins", evidence: "confirmed" }, { id: "lactic-acid", evidence: "confirmed" }],
    accent: "magenta", url: "https://mb.kubsau.ru/catalog/aktinomitsety/bifidobacterium/animalis/ceem-ac-026/",
  },
];

const categoryLabels: Record<Category, Localized> = {
  all: l("Все группы", "All groups"), bacteria: l("Бактерии", "Bacteria"), fungi: l("Грибы", "Fungi"), actinomycetes: l("Актиномицеты", "Actinomycetes"),
};
const categories: Array<{ value: Category; count?: number }> = [{ value: "all" }, { value: "bacteria", count: 196 }, { value: "fungi", count: 64 }, { value: "actinomycetes", count: 9 }];

const applicationDefinitions: Array<{ id: ApplicationId; label: Localized; short: Localized; description: Localized; icon: typeof Sprout }> = [
  { id: "all", label: l("Все направления", "All applications"), short: l("Все", "All"), description: l("Вся демонстрационная выборка", "All featured examples"), icon: Layers3 },
  { id: "plant-nutrition", label: l("Питание и рост растений", "Plant nutrition & growth"), short: l("Рост растений", "Plant growth"), description: l("Азотфиксация, мобилизация питания и стимуляция роста — после проверки на уровне штамма", "Nitrogen fixation, nutrient mobilisation and growth promotion — once verified at strain level"), icon: Sprout },
  { id: "plant-protection", label: l("Защита растений", "Plant protection"), short: l("Защита растений", "Plant protection"), description: l("Антагонисты фитопатогенов, биофунгициды и диагностические модели", "Antagonists of plant pathogens, biofungicides and diagnostic models"), icon: ShieldCheck },
  { id: "pest-control", label: l("Биоконтроль вредителей", "Biological pest control"), short: l("Биоконтроль", "Pest control"), description: l("Микроорганизмы для исследований биологической борьбы с вредителями", "Microorganisms studied for biological pest management"), icon: Bug },
  { id: "animal-health", label: l("Здоровье животных", "Animal health"), short: l("Здоровье животных", "Animal health"), description: l("Пробиотические культуры, микробиом и кормовые добавки", "Probiotic cultures, microbiome research and feed additives"), icon: HeartPulse },
  { id: "food", label: l("Пищевые технологии", "Food technologies"), short: l("Пищевые технологии", "Food tech"), description: l("Ферментация, органические кислоты и защитные культуры", "Fermentation, organic acids and protective cultures"), icon: Wheat },
  { id: "industrial", label: l("Промышленная биотехнология", "Industrial biotechnology"), short: l("Промбиотех", "Industrial biotech"), description: l("Микробные метаболиты, ферменты и целевые биопродукты", "Microbial metabolites, enzymes and target bioproducts"), icon: Factory },
  { id: "diagnostics", label: l("Диагностика и исследования", "Diagnostics & research"), short: l("Диагностика", "Diagnostics"), description: l("Референсные культуры, тест-системы и сравнительные исследования", "Reference cultures, test systems and comparative studies"), icon: ScanSearch },
  { id: "bioconversion", label: l("Биоконверсия", "Fungal bioconversion"), short: l("Биоконверсия", "Bioconversion"), description: l("Грибные технологии и переработка растительного сырья", "Fungal technologies and transformation of plant biomass"), icon: FlaskConical },
];

const traitLabels: Record<TraitId, Localized> = {
  "plant-growth": l("Стимуляция роста растений", "Plant growth promotion"), antagonism: l("Микробный антагонизм", "Microbial antagonism"), lipopeptides: l("Липопептиды", "Lipopeptides"),
  probiotic: l("Пробиотический потенциал", "Probiotic potential"), "diagnostic-model": l("Диагностическая модель", "Diagnostic model"), reference: l("Референсная культура", "Reference culture"),
  "pest-control": l("Биоконтроль вредителей", "Biological pest control"), bacteriocins: l("Продукция бактериоцинов", "Bacteriocin production"), "lactic-acid": l("Продукция молочной кислоты", "Lactic acid production"),
  biotransformation: l("Биотрансформация сырья", "Biomass transformation"),
};

const ui = {
  navigation: { catalog: l("Коллекция", "Collection"), process: l("Как работает коллекция", "How the Collection Works"), about: l("О КЭЭМ", "About CEEM") },
  evidence: { confirmed: l("Подтверждено для штамма", "Confirmed for this strain"), potential: l("Исследовательский потенциал", "Research potential") },
};

type JourneyStep = { title: Localized; text: Localized };

function getJourney(strain: Strain): JourneyStep[] {
  if (strain.id === "b-062") return [
    { title: l("Природный источник", "Natural source"), text: l("Кишечный канал пчёл карпатской породы.", "The intestinal tract of Carpathian honey bees.") },
    { title: l("Получение культуры", "Culture isolation"), text: l("Из биоматериала выделен автохтонный микроорганизм.", "An autochthonous microorganism was isolated from the biological sample.") },
    { title: l("Исследование", "Characterisation"), text: l("Изучены биохимические и антагонистические свойства, выполнено полногеномное секвенирование.", "Biochemical and antagonistic properties were studied and whole-genome sequencing was completed.") },
    { title: l("Перспектива", "Potential"), text: l("Оценивается применение в биологических средствах защиты и кормовых добавках для пчеловодства.", "Its use in biological protection products and feed additives for apiculture is being evaluated.") },
  ];
  if (strain.id === "b-155") return [
    { title: l("Место обнаружения", "Site of detection"), text: l("Корончатые галлы на стеблях винограда в Краснодарском крае.", "Crown galls on grapevine stems in Krasnodar Krai.") },
    { title: l("Получение культуры", "Culture isolation"), text: l("Из поражённой ткани выделена чистая культура возбудителя.", "A pure culture of the pathogen was isolated from affected tissue.") },
    { title: l("Коллекционный статус", "Collection status"), text: l("Штамм идентифицирован и внесён в коллекцию под номером CEEM B-155.", "The strain was identified and deposited in the collection as CEEM B-155.") },
    { title: l("Использование", "Use"), text: l("Диагностическая работа и фитопатологические исследования бактериального рака винограда.", "Diagnostics and phytopathology research on grapevine crown gall.") },
  ];
  const result = strain.products.length
    ? l(`Связанные продукты: ${strain.products.map((item) => item.ru).join(", ")}.`, `Associated products: ${strain.products.map((item) => item.en).join(", ")}.`)
    : l(`Текущее назначение в каталоге: ${strain.role.ru.toLowerCase()}.`, `Current catalogue role: ${strain.role.en.toLowerCase()}.`);
  return [
    { title: l("Происхождение", "Origin"), text: strain.origin },
    { title: l("Идентификация", "Identification"), text: l("Видовая принадлежность подтверждена, культура включена в биоресурсный фонд КЭЭМ.", "Species identity was verified and the culture was included in the CEEM biorepository.") },
    { title: l("Паспортизация", "Strain record"), text: l(`Присвоен номер ${strain.registry}. Оптимальная температура роста: ${strain.temperature.ru}.`, `Registry number: ${strain.registry}. Optimal growth temperature: ${strain.temperature.en}.`) },
    { title: l("Исследовательский потенциал", "Research potential"), text: result },
  ];
}

function BrandMark({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  return <span className="brand" aria-label="CEEM"><span className="brand-hex" aria-hidden="true" /><span className={compact ? "brand-word compact" : "brand-word"}>{lang === "ru" ? "КЭЭМ" : "CEEM"}</span></span>;
}

function UniversityIdentity({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  return (
    <span className={compact ? "university-identity compact" : "university-identity"}>
      <img
        src={publicAsset("/images/kubsau-brand-mark.svg")}
        alt={tx(l("Логотип Кубанского ГАУ", "Kuban State Agrarian University logo"), lang)}
      />
    </span>
  );
}

type NormalizedPoint = { x: number; y: number };
type Filament = {
  points: [NormalizedPoint, NormalizedPoint, NormalizedPoint, NormalizedPoint];
  colors: [string, string, string];
  pulse: string;
  duration: number;
  phase: number;
};

/*
 * Нити рисуются на canvas как кривые Безье. Поверх каждой базовой нити
 * проходит короткий световой импульс — так фон напоминает обмен сигналами
 * внутри микробного сообщества, но остаётся спокойным и малоконтрастным.
 */
function BiofilmCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const filaments: Filament[] = [
      { points: [{ x: 0.38, y: 0.12 }, { x: 0.54, y: 0.02 }, { x: 0.66, y: 0.34 }, { x: 1.05, y: 0.22 }], colors: ["rgba(158,210,188,.08)", "rgba(145,190,216,.15)", "rgba(210,166,189,.08)"], pulse: "rgba(190,232,214,.78)", duration: 16500, phase: 0.08 },
      { points: [{ x: 0.46, y: 0.31 }, { x: 0.64, y: 0.17 }, { x: 0.71, y: 0.61 }, { x: 1.06, y: 0.49 }], colors: ["rgba(209,170,190,.07)", "rgba(159,199,222,.14)", "rgba(170,211,186,.08)"], pulse: "rgba(184,214,232,.78)", duration: 21000, phase: 0.44 },
      { points: [{ x: 0.35, y: 0.66 }, { x: 0.56, y: 0.48 }, { x: 0.73, y: 0.91 }, { x: 1.04, y: 0.72 }], colors: ["rgba(168,211,189,.07)", "rgba(215,181,153,.13)", "rgba(209,164,189,.08)"], pulse: "rgba(230,205,175,.72)", duration: 24500, phase: 0.69 },
      { points: [{ x: 0.58, y: -0.05 }, { x: 0.79, y: 0.23 }, { x: 0.55, y: 0.58 }, { x: 0.76, y: 1.06 }], colors: ["rgba(150,193,219,.06)", "rgba(174,214,190,.13)", "rgba(210,166,190,.07)"], pulse: "rgba(189,228,210,.72)", duration: 28000, phase: 0.27 },
      { points: [{ x: 0.43, y: 0.91 }, { x: 0.64, y: 0.71 }, { x: 0.79, y: 1.02 }, { x: 1.08, y: 0.9 }], colors: ["rgba(210,164,190,.06)", "rgba(151,194,219,.14)", "rgba(164,210,188,.07)"], pulse: "rgba(222,187,207,.72)", duration: 19000, phase: 0.83 },
    ];

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let previousFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const pointOnCurve = (points: Filament["points"], t: number) => {
      const inverse = 1 - t;
      return {
        x: (inverse ** 3 * points[0].x + 3 * inverse ** 2 * t * points[1].x + 3 * inverse * t ** 2 * points[2].x + t ** 3 * points[3].x) * width,
        y: (inverse ** 3 * points[0].y + 3 * inverse ** 2 * t * points[1].y + 3 * inverse * t ** 2 * points[2].y + t ** 3 * points[3].y) * height,
      };
    };

    const drawPulse = (filament: Filament, from: number, to: number) => {
      if (to <= from) return;
      const start = pointOnCurve(filament.points, from);
      const end = pointOnCurve(filament.points, to);
      const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.58, filament.pulse);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.beginPath();
      for (let step = 0; step <= 24; step += 1) {
        const point = pointOnCurve(filament.points, from + ((to - from) * step) / 24);
        if (step === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.strokeStyle = gradient;
      context.lineWidth = 2.1;
      context.lineCap = "round";
      context.shadowColor = filament.pulse;
      context.shadowBlur = 12;
      context.stroke();
      context.shadowBlur = 0;
    };

    const draw = (time: number) => {
      if (!reducedMotion && time - previousFrame < 32) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      previousFrame = time;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";

      filaments.forEach((filament) => {
        const points = filament.points.map((point) => ({ x: point.x * width, y: point.y * height })) as [NormalizedPoint, NormalizedPoint, NormalizedPoint, NormalizedPoint];
        const gradient = context.createLinearGradient(points[0].x, points[0].y, points[3].x, points[3].y);
        gradient.addColorStop(0, filament.colors[0]);
        gradient.addColorStop(0.52, filament.colors[1]);
        gradient.addColorStop(1, filament.colors[2]);
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        context.strokeStyle = gradient;
        context.lineWidth = 1.05;
        context.lineCap = "round";
        context.stroke();

        if (!reducedMotion) {
          const head = ((time / filament.duration) + filament.phase) % 1;
          const tail = head - 0.14;
          if (tail < 0) {
            drawPulse(filament, 1 + tail, 1);
            drawPulse(filament, 0, head);
          } else {
            drawPulse(filament, tail, head);
          }
        }
      });

      context.globalCompositeOperation = "source-over";
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="biofilm-canvas" aria-hidden="true" />;
}

/* Абстрактное микрополе: клетки, орбиты и биоплёночные нити. */
function MicroField() {
  return (
    <span className="micro-field" aria-hidden="true">
      <span className="pointer-glow" />
      <span className="micro-orbit orbit-one" />
      <span className="micro-orbit orbit-two" />
      <BiofilmCanvas />
      {Array.from({ length: 14 }, (_, index) => <span className={`micro-particle particle-${index + 1}`} key={index} />)}
    </span>
  );
}

function EvidenceBadge({ evidence, lang, compact = false }: { evidence: Evidence; lang: Lang; compact?: boolean }) {
  const short = evidence === "confirmed" ? l("Подтверждено", "Confirmed") : l("Потенциал", "Potential");
  return <span className={`evidence-badge ${evidence}`}>{compact ? tx(short, lang) : tx(ui.evidence[evidence], lang)}</span>;
}

/*
 * Оба языка всегда видны. Цветной ползунок показывает текущий выбор и
 * одновременно подсказывает, что переключатель можно нажать.
 */
function LanguageToggle({ lang, className = "", onChange }: { lang: Lang; className?: string; onChange: () => void }) {
  return (
    <button
      type="button"
      className={`language-toggle ${className}`}
      onClick={onChange}
      aria-label={tx(l("Переключить на английский язык", "Switch to Russian"), lang)}
    >
      <span className={`language-toggle-thumb ${lang === "en" ? "is-en" : ""}`} aria-hidden="true" />
      <span className={lang === "ru" ? "active" : ""}>RU</span>
      <span className={lang === "en" ? "active" : ""}>EN</span>
    </button>
  );
}

function StrainCard({ strain, active, lang, onSelect }: { strain: Strain; active: boolean; lang: Lang; onSelect: () => void }) {
  const leadingApplication = applicationDefinitions.find((item) => item.id === strain.applications[0]?.id);
  return (
    <button type="button" className={`strain-card accent-${strain.accent} ${active ? "active" : ""}`} onClick={onSelect} aria-pressed={active}>
      <span className="strain-thumb" aria-hidden="true"><img src={strain.image} alt="" /></span>
      <span className="strain-card-copy"><span className="strain-registry">{strain.registry}</span><strong>{strain.name}</strong><span className="strain-card-role">{tx(strain.role, lang)}</span>
        {leadingApplication ? <span className="card-application">{tx(leadingApplication.short, lang)} <EvidenceBadge evidence={strain.applications[0].evidence} lang={lang} compact /></span> : null}
      </span><ChevronRight className="strain-chevron" aria-hidden="true" />
    </button>
  );
}

function CatalogView({ selected, lang, onSelect, onOpen }: { selected: Strain; lang: Lang; onSelect: (strain: Strain) => void; onOpen: () => void }) {
  const [browseMode, setBrowseMode] = useState<BrowseMode>("applications");
  const [category, setCategory] = useState<Category>("all");
  const [application, setApplication] = useState<ApplicationId>("all");
  const filtered = useMemo(() => {
    if (browseMode === "taxonomy") return category === "all" ? strains : strains.filter((strain) => strain.category === category);
    return application === "all" ? strains : strains.filter((strain) => strain.applications.some((item) => item.id === application));
  }, [application, browseMode, category]);
  const selectedApplications = selected.applications.map((tag) => ({ tag, definition: applicationDefinitions.find((item) => item.id === tag.id) })).filter((item) => item.definition);

  return <div className="catalog-view">
    <section className={`featured accent-${selected.accent}`}>
      <span className="featured-orbit" aria-hidden="true" />
      <div className="featured-image-wrap"><img src={selected.image} alt={`${tx(l("Визуализация", "Visualization"), lang)} ${selected.name}`} className="featured-image" /><span className="visualization-badge"><Sparkles aria-hidden="true" /> {tx(l("Визуализация", "Visualization"), lang)}</span></div>
      <div className="featured-copy"><span className="eyebrow">{tx(categoryLabels[selected.category], lang)}</span><h1>{selected.name}</h1>
        <div className="registry-line"><span>{selected.registry}</span><span className="divider" /><span>{tx(selected.role, lang)}</span></div><p>{tx(selected.description, lang)}</p>
        <div className="featured-applications" aria-label={tx(l("Области применения", "Application areas"), lang)}>{selectedApplications.slice(0, 3).map(({ tag, definition }) => <span key={tag.id}>{tx(definition!.short, lang)} <EvidenceBadge evidence={tag.evidence} lang={lang} compact /></span>)}</div>
        <div className="featured-facts"><div><MapPin aria-hidden="true" /><span>{tx(l("Происхождение", "Origin"), lang)}</span><strong>{tx(selected.origin, lang)}</strong></div><div><Thermometer aria-hidden="true" /><span>{tx(l("Температура", "Temperature"), lang)}</span><strong>{tx(selected.temperature, lang)}</strong></div></div>
        <Button className="primary-touch" onClick={onOpen}>{tx(l("Открыть паспорт штамма", "Open strain record"), lang)} <ArrowRight aria-hidden="true" /></Button>
      </div>
    </section>

    <section className="catalog-panel" aria-label={tx(l("Каталог микроорганизмов", "Microorganism catalogue"), lang)}>
      <div className="catalog-heading"><div><span className="eyebrow">{tx(l("Демонстрационный каталог", "Featured catalogue"), lang)}</span><h2>{tx(l("Исследуйте коллекцию", "Explore the collection"), lang)}</h2></div><div className="catalog-count"><Search aria-hidden="true" /> {filtered.length} {tx(l("примеров", "examples"), lang)}</div></div>
      <div className="browse-switch" role="group" aria-label={tx(l("Способ просмотра", "Browse mode"), lang)}><button type="button" className={browseMode === "applications" ? "active" : ""} onClick={() => setBrowseMode("applications")}><Sparkles aria-hidden="true" />{tx(l("По применению", "By application"), lang)}</button><button type="button" className={browseMode === "taxonomy" ? "active" : ""} onClick={() => setBrowseMode("taxonomy")}><Dna aria-hidden="true" />{tx(l("По систематике", "By taxonomy"), lang)}</button></div>
      {browseMode === "taxonomy" ? <Tabs value={category} onValueChange={(value) => setCategory(value as Category)} className="category-tabs"><TabsList className="category-list">{categories.map((item) => <TabsTrigger key={item.value} value={item.value} className="category-trigger">{tx(categoryLabels[item.value], lang)}{item.count ? <span>{item.count}</span> : null}</TabsTrigger>)}</TabsList></Tabs> :
        <div className="application-browser"><div className="application-chips" role="group" aria-label={tx(l("Области применения", "Application areas"), lang)}>{applicationDefinitions.map((item) => { const count = item.id === "all" ? strains.length : strains.filter((strain) => strain.applications.some((tag) => tag.id === item.id)).length; const Icon = item.icon; return <button key={item.id} type="button" className={application === item.id ? "active" : ""} onClick={() => setApplication(item.id)}><Icon aria-hidden="true" /><span>{tx(item.short, lang)}</span><small>{count}</small></button>; })}</div><div className="application-explainer"><span>{tx(applicationDefinitions.find((item) => item.id === application)!.description, lang)}</span></div></div>}
      <div className="strain-grid">{filtered.map((strain) => <StrainCard key={strain.id} strain={strain} active={selected.id === strain.id} lang={lang} onSelect={() => onSelect(strain)} />)}</div>
      <div className="catalog-note"><span>{tx(l("269 позиций в открытом каталоге", "269 entries in the public catalogue"), lang)}</span><span className="note-dot" /><span>{tx(l("Более 500 штаммов в фонде", "More than 500 strains preserved"), lang)}</span></div>
    </section>
  </div>;
}

function ProcessView({ lang }: { lang: Lang }) {
  const stages = [
    ["01", Sprout, l("Выделение", "Isolation"), l("Образец получают из почвы, растения, организма животного или другого природного источника.", "A sample is obtained from soil, a plant, an animal or another natural source."), "green"],
    ["02", Microscope, l("Идентификация", "Identification"), l("Культура проходит исследование с применением MALDI-TOF MS и молекулярно-биологических методов.", "The culture is studied using MALDI-TOF MS and molecular biology methods."), "cyan"],
    ["03", Box, l("Сохранение", "Preservation"), l("Подтверждённый штамм сохраняют в криоконсервированном или лиофилизированном виде.", "The verified strain is preserved by cryoconservation or lyophilisation."), "magenta"],
    ["04", FlaskConical, l("Применение", "Application"), l("Коллекционный ресурс становится основой исследований, диагностики и новых биотехнологий.", "The preserved resource becomes a basis for research, diagnostics and new biotechnologies."), "amber"],
  ] as const;
  return <section className="story-view"><div className="story-intro"><span className="eyebrow">{tx(l("Общая схема работы биоресурсного фонда", "How a biological resource is managed"), lang)}</span><h1>{tx(l("Как работает коллекция", "How the Collection Works"), lang)}</h1><p>{tx(l("Это общий процесс для коллекционных культур. Индивидуальный путь конкретного микроорганизма показан в его паспорте.", "This is the general process for collection cultures. Each microorganism has its own journey in its strain record."), lang)}</p></div>
    <div className="process-track">{stages.map(([number, Icon, title, text, accent], index) => <article key={number} className={`process-card accent-${accent}`}><span className="process-number">{number}</span><span className="process-icon"><Icon aria-hidden="true" /></span><h2>{tx(title, lang)}</h2><p>{tx(text, lang)}</p>{index < stages.length - 1 ? <ArrowRight className="process-arrow" aria-hidden="true" /> : null}</article>)}</div>
    <div className="method-strip"><span><Dna aria-hidden="true" /> {tx(l("Секвенирование ДНК", "DNA sequencing"), lang)}</span><span><Microscope aria-hidden="true" /> MALDI-TOF MS</span><span><Beaker aria-hidden="true" /> {tx(l("Культуральные методы", "Culture methods"), lang)}</span></div></section>;
}

function AboutView({ lang }: { lang: Lang }) {
  return <section className="about-view"><div className="about-copy"><span className="eyebrow">{tx(l("Биоресурсный фонд Кубанского ГАУ", "Kuban State Agrarian University biorepository"), lang)}</span><h1>{tx(l("Коллекция, которая сохраняет возможности", "Preserving living possibilities"), lang)}</h1><p>{tx(l("КЭЭМ формируется с 2022 года на базе Центра биотехнологий. В фонде представлены бактерии, грибы и бактериофаги, связанные прежде всего с сельскохозяйственными животными, растениями и агроценозами.", "CEEM has been developed at the Biotechnology Centre since 2022. Its holdings include bacteria, fungi and bacteriophages associated primarily with agricultural animals, plants and agroecosystems."), lang)}</p><div className="status-card"><Globe2 aria-hidden="true" /><div><strong>{tx(l("Международная инфраструктура", "International infrastructure"), lang)}</strong><span>{tx(l("Коллекция включена в глобальный каталог WDCM/GCM и имеет статус международного органа по депонированию для патентной процедуры.", "The collection is included in the WDCM/GCM global catalogue and holds International Depositary Authority status for patent procedure."), lang)}</span></div></div></div>
    <div className="about-stats"><article className="stat-card primary-stat"><span className="stat-number">500+</span><strong>{tx(l("штаммов", "strains"), lang)}</strong><p>{tx(l("Общий объём хранения биоресурсного фонда", "Total holdings of the biorepository"), lang)}</p></article><article className="stat-card"><span className="stat-number">3</span><strong>{tx(l("формы биоресурса", "resource groups"), lang)}</strong><p>{tx(l("Бактерии, грибы и бактериофаги", "Bacteria, fungi and bacteriophages"), lang)}</p></article><article className="stat-card"><span className="stat-number">2022</span><strong>{tx(l("год создания", "established"), lang)}</strong><p>{tx(l("Начало формирования коллекции на базе университета", "The collection was founded at the university"), lang)}</p></article><article className="stat-card accent-card"><BookOpen aria-hidden="true" /><strong>{tx(l("Открытый каталог", "Public catalogue"), lang)}</strong><p>{tx(l("Паспорта культур и параметры хранения доступны исследователям", "Culture records and preservation data are available to researchers"), lang)}</p></article></div></section>;
}

/*
 * На обзорном экране остаётся одно главное изображение. Полноценная галерея
 * живёт в паспорте и показывает навигацию только тогда, когда снимков больше одного.
 */
function StrainGallery({ strain, lang }: { strain: Strain; lang: Lang }) {
  const images = strain.images?.length ? strain.images : [strain.image];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => { setActiveIndex(0); }, [strain.id]);

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div className="strain-gallery">
      <div className="strain-image-stage">
        <img
          src={images[activeIndex] ?? strain.image}
          alt={`${tx(l("Визуализация", "Visualization"), lang)} ${strain.name}${images.length > 1 ? `, ${activeIndex + 1}/${images.length}` : ""}`}
        />
      </div>
      <div className="gallery-footer">
        <span className="visualization-badge"><Sparkles aria-hidden="true" /> {tx(l("Визуализация", "Visualization"), lang)}</span>
        {images.length > 1 ? <div className="gallery-controls">
          <button type="button" className="gallery-arrow" onClick={() => move(-1)} aria-label={tx(l("Предыдущее изображение", "Previous image"), lang)}><ChevronLeft aria-hidden="true" /></button>
          <div className="gallery-thumbnails" aria-label={tx(l("Изображения штамма", "Strain images"), lang)}>{images.map((image, index) => <button type="button" key={`${image}-${index}`} className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`${tx(l("Изображение", "Image"), lang)} ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined}><img src={image} alt="" /></button>)}</div>
          <button type="button" className="gallery-arrow" onClick={() => move(1)} aria-label={tx(l("Следующее изображение", "Next image"), lang)}><ChevronRight aria-hidden="true" /></button>
          <span className="gallery-count">{activeIndex + 1} / {images.length}</span>
        </div> : null}
      </div>
    </div>
  );
}

function StrainSheet({ strain, lang, open, onOpenChange }: { strain: Strain; lang: Lang; open: boolean; onOpenChange: (open: boolean) => void }) {
  const journey = getJourney(strain);
  const facts = [[MapPin, l("Происхождение", "Origin"), strain.origin], [Thermometer, l("Оптимальная температура", "Optimal temperature"), strain.temperature], [FlaskConical, l("Роль в коллекции", "Collection role"), strain.role], [Box, l("Категория", "Category"), categoryLabels[strain.category]]] as const;
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="right" className={`strain-sheet accent-${strain.accent}`}><SheetHeader className="sheet-heading"><span className="eyebrow">{tx(l("Паспорт коллекционного штамма", "Collection strain record"), lang)}</span><SheetTitle>{strain.name}</SheetTitle><SheetDescription>{strain.registry}</SheetDescription></SheetHeader>
    <div className="sheet-body"><div className="sheet-details"><p className="sheet-description">{tx(strain.description, lang)}</p>
      <section className="classification-block" aria-label={tx(l("Прикладная классификация", "Application classification"), lang)}><span className="eyebrow">{tx(l("Области применения", "Application areas"), lang)}</span><div className="classification-list">{strain.applications.map((tag) => { const definition = applicationDefinitions.find((item) => item.id === tag.id)!; const Icon = definition.icon; return <article key={tag.id}><Icon aria-hidden="true" /><div><strong>{tx(definition.label, lang)}</strong><span>{tx(definition.description, lang)}</span></div><EvidenceBadge evidence={tag.evidence} lang={lang} /></article>; })}</div><span className="eyebrow traits-title">{tx(l("Функциональные метки", "Functional traits"), lang)}</span><div className="trait-list">{strain.traits.map((tag) => <span key={tag.id}>{tx(traitLabels[tag.id], lang)} <EvidenceBadge evidence={tag.evidence} lang={lang} compact /></span>)}</div></section>
      <section className="strain-journey" aria-label={tx(l("История штамма", "Strain journey"), lang)}><span className="eyebrow">{tx(l("История штамма", "Strain journey"), lang)}</span><div className="journey-list">{journey.map((step, index) => <article key={step.title.en} className="journey-step"><span className="journey-number">{String(index + 1).padStart(2, "0")}</span><div><strong>{tx(step.title, lang)}</strong><p>{tx(step.text, lang)}</p></div></article>)}</div></section>
      <div className="detail-grid">{facts.map(([Icon, label, value]) => <article key={label.en}><Icon aria-hidden="true" /><span>{tx(label, lang)}</span><strong>{tx(value, lang)}</strong></article>)}</div>
      <div className="products-block"><span className="eyebrow">{tx(l("Продукты и потенциал", "Products and potential"), lang)}</span>{strain.products.length ? <div className="product-list">{strain.products.map((product) => <span key={product.en}>{tx(product, lang)}</span>)}</div> : <p>{tx(l("Сведения о производимом продукте в открытой карточке не указаны.", "The public record does not specify a produced compound."), lang)}</p>}</div>
      <a className="source-link" href={strain.url} target="_blank" rel="noreferrer">{tx(l("Карточка на сайте КЭЭМ", "View the CEEM source record"), lang)} <ArrowRight aria-hidden="true" /></a>
    </div><div className="sheet-visual"><StrainGallery strain={strain} lang={lang} /></div></div></SheetContent></Sheet>;
}

function AttractScreen({ lang, onLanguageChange, onEnter }: { lang: Lang; onLanguageChange: () => void; onEnter: () => void }) {
  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <section className="attract-screen" onPointerMove={handlePointerMove}>
      <MicroField />
      <button type="button" className="attract-enter" onClick={onEnter} aria-label={tx(l("Открыть коллекцию", "Open the collection"), lang)}>
        <span className="attract-grid" aria-hidden="true" />
        <span className="attract-identity">
          <UniversityIdentity lang={lang} />
          <span className="identity-divider" aria-hidden="true" />
          <BrandMark lang={lang} />
        </span>
        <span className="attract-copy">
          <span className="eyebrow">{tx(l("Биоресурсный фонд Центра биотехнологий", "Biorepository of the Biotechnology Centre"), lang)}</span>
          <strong className="attract-title">{lang === "ru" ? <>Коллекция<br />микроорганизмов</> : <>Microbial<br />Culture Collection</>}</strong>
          <span className="attract-subtitle">{tx(l("Банк живых технологий", "Living Resources for Biotechnology"), lang)}</span>
          <span className="touch-callout">{tx(l("Коснитесь экрана", "Touch to explore"), lang)} <ArrowRight aria-hidden="true" /></span>
        </span>
        <span className="attract-dish" aria-hidden="true"><span className="attract-halo" /><img src={visualAssets.trichoderma} alt="" /></span>
      </button>
      <LanguageToggle lang={lang} className="language-switch" onChange={onLanguageChange} />
    </section>
  );
}

export default function Kiosk() {
  const [view, setView] = useState<View>("catalog");
  const [lang, setLang] = useState<Lang>("ru");
  const [selected, setSelected] = useState(strains[0]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [attractMode, setAttractMode] = useState(true);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  /* После 90 секунд бездействия витрина возвращается к русской заставке. */
  useEffect(() => {
    if (attractMode) return;
    let timer = window.setTimeout(() => { setSheetOpen(false); setView("catalog"); setLang("ru"); setAttractMode(true); }, 90_000);
    const resetTimer = () => { window.clearTimeout(timer); timer = window.setTimeout(() => { setSheetOpen(false); setView("catalog"); setLang("ru"); setAttractMode(true); }, 90_000); };
    window.addEventListener("pointerdown", resetTimer); window.addEventListener("keydown", resetTimer);
    return () => { window.clearTimeout(timer); window.removeEventListener("pointerdown", resetTimer); window.removeEventListener("keydown", resetTimer); };
  }, [attractMode]);

  const toggleLanguage = () => setLang((current) => current === "ru" ? "en" : "ru");
  if (attractMode) return <AttractScreen lang={lang} onLanguageChange={toggleLanguage} onEnter={() => setAttractMode(false)} />;
  const navigation = [{ value: "catalog" as const, label: ui.navigation.catalog, icon: Layers3 }, { value: "process" as const, label: ui.navigation.process, icon: Dna }, { value: "about" as const, label: ui.navigation.about, icon: Info }];

  return <main className="kiosk-shell"><header className="topbar"><button type="button" className="brand-button" onClick={() => setAttractMode(true)} aria-label={tx(l("Вернуться к заставке", "Return to welcome screen"), lang)}><span className="topbar-identity"><UniversityIdentity lang={lang} compact /><span className="topbar-divider" aria-hidden="true" /><BrandMark lang={lang} compact /></span></button><nav aria-label={tx(l("Основная навигация", "Main navigation"), lang)}>{navigation.map((item) => { const Icon = item.icon; return <button type="button" key={item.value} className={view === item.value ? "active" : ""} onClick={() => setView(item.value)}><Icon aria-hidden="true" />{tx(item.label, lang)}</button>; })}</nav><div className="topbar-meta"><span>{tx(l("Кубанский ГАУ", "Kuban State Agrarian University"), lang)}</span><LanguageToggle lang={lang} className="language-button" onChange={toggleLanguage} /></div></header>
    <div className="main-surface">{view === "catalog" ? <CatalogView selected={selected} lang={lang} onSelect={setSelected} onOpen={() => setSheetOpen(true)} /> : null}{view === "process" ? <ProcessView lang={lang} /> : null}{view === "about" ? <AboutView lang={lang} /> : null}</div><StrainSheet strain={selected} lang={lang} open={sheetOpen} onOpenChange={setSheetOpen} /></main>;
}
