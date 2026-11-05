import { ProjectItem } from "@/types";

export const PROJECT_FILTERS = [
  { filter: "all", label: "Todos" },
  { filter: ".web", label: "Fast Food" },
  { filter: ".game", label: "Tecnologia" },
  { filter: ".design", label: "Viagens" },
] as const;

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "wine",
    category: ".web",
    image: "/assets/projects/wine.webp",
    alt: "project wine",
  },
  {
    id: "burguer",
    category: ".web",
    image: "/assets/projects/burguer.webp",
    alt: "project burguer",
  },
  {
    id: "woocommerce",
    category: ".game",
    image: "/assets/projects/woocommerce.webp",
    alt: "project woocommerce",
  },
  {
    id: "pixologia",
    category: ".game",
    image: "/assets/projects/pixologia.webp",
    alt: "project pixologia",
  },
  {
    id: "hotel",
    category: ".design",
    image: "/assets/projects/hotel.webp",
    alt: "project hotel",
  },
  {
    id: "wdm",
    category: ".design",
    image: "/assets/projects/wdm.webp",
    alt: "project wdm",
  },
];
