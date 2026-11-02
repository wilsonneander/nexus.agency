import Image from "next/image";
import { BLOG_DATA } from "@/data/blog";

export function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-secondary">
      <div className="max-w-container mx-auto px-4">
        <p className="text-sm font-medium text-primary-dark text-center mb-2">Postagens de blog</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">
          Atualidades sobre tecnologia
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {BLOG_DATA.map((post) => (
            <div key={post.id} className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-md">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs font-semibold text-primary-dark uppercase tracking-wider">
                {post.tag}
              </p>
              <h4 className="text-base font-semibold leading-snug">{post.title}</h4>
              <a
                href={post.href}
                className="text-white/80 hover:text-primary-dark transition-colors text-sm font-medium inline-block mt-1"
              >
                Saiba Mais
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
