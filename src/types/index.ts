export type ProjectCategory = "all" | ".web" | ".game" | ".design";

export type ProjectItem = {
  id: string;
  category: ProjectCategory;
  image: string;
  alt: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  iconClass: string;
  benefits?: string[];
};

export type CommercialPackage = {
  id: string;
  name: string;
  includes: string;
  targetAudience: string;
  highlight?: boolean;
};
