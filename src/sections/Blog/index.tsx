import Image from "next/image";
import { BLOG_DATA } from "@/data/blog";
import { BlogClient } from "./BlogClient";

export function BlogSection() {
  return (
    <BlogClient>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#a15cf5] mb-2">
            Postagens de blog
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Atualidades sobre tecnologia
          </h2>
        </div>

        <div data-blog-grid className="glass-ambient grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_DATA.map((post) => (
            <article
              key={post.id}
              data-blog-card
              className="glass-card group rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={450}
                    height={280}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-[#a15cf5] uppercase tracking-wider mb-2">
                    {post.tag}
                  </p>
                  <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-[#ad7dff] transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <a
                  href={post.href}
                  className="text-sm font-medium text-white/80 hover:text-[#a15cf5] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Saiba Mais</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </BlogClient>
  );
}
