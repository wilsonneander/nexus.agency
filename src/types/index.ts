export type NavItem = {
  label: string;
  href: string;
};

export type ProjectCategory = "all" | ".web" | ".game" | ".design";

export type ProjectItem = {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  image: string;
  alt: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  iconClass: string;
};

export type BlogPostItem = {
  id: string;
  tag: string;
  title: string;
  image: string;
  href: string;
};

export type SocialLink = {
  platform: "instagram" | "linkedin" | "facebook";
  url: string;
  iconClass: string;
  label: string;
};
