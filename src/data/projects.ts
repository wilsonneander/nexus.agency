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
    title: "Wine",
    category: ".web",
    categoryLabel: "Fast Food",
    image: "/assets/projects/wine.webp",
    alt: "project wine",
  },
  {
    id: "burguer",
    title: "Burguer",
    category: ".web",
    categoryLabel: "Fast Food",
    image: "/assets/projects/burguer.webp",
    alt: "project burguer",
  },
  {
    id: "woocommerce",
    title: "WooCommerce",
    category: ".game",
    categoryLabel: "Tecnologia",
    image: "/assets/projects/woocommerce.webp",
    alt: "project woocommerce",
  },
  {
    id: "pixologia",
    title: "Pixologia",
    category: ".game",
    categoryLabel: "Tecnologia",
    image: "/assets/projects/pixologia.webp",
    alt: "project pixologia",
  },
  {
    id: "hotel",
    title: "Hotel",
    category: ".design",
    categoryLabel: "Viagens",
    image: "/assets/projects/hotel.webp",
    alt: "project hotel",
  },
  {
    id: "wdm",
    title: "WDM",
    category: ".design",
    categoryLabel: "Viagens",
    image: "/assets/projects/wdm.webp",
    alt: "project wdm",
  },
];
