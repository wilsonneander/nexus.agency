import { HeroSection } from "@/sections/Hero";
import { AboutSection } from "@/sections/About";
import { BannersSection } from "@/sections/Banners";
import { ProjectsSection } from "@/sections/Projects";
import { ServicesSection } from "@/sections/Services";
import { BlogSection } from "@/sections/Blog";
import { ContactSection } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <BannersSection />
      <ProjectsSection />
      <ServicesSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
