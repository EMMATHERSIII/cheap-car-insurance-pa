import { getPublishedBlogPosts } from "./db";

export async function generateSitemap(): Promise<string> {
  const baseUrl = "https://cheapcarinsurancepennsylvania.com";
  const currentDate = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    { url: "/about", changefreq: "monthly", priority: "0.8" },
    { url: "/contact", changefreq: "monthly", priority: "0.8" },
    { url: "/blog", changefreq: "daily", priority: "0.9" },
    { url: "/how-it-works", changefreq: "monthly", priority: "0.8" },
    { url: "/privacy", changefreq: "yearly", priority: "0.3" },
    { url: "/terms", changefreq: "yearly", priority: "0.3" },
    { url: "/disclaimer", changefreq: "yearly", priority: "0.3" },
    { url: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
    { url: "/refund-policy", changefreq: "yearly", priority: "0.3" },
  ];

  // Get all blog posts
  const blogPosts = await getPublishedBlogPosts();

  // Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  for (const page of staticPages) {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += "  </url>\n";
  }

  // Add blog posts
  for (const post of blogPosts) {
    const postDate = post.publishedAt
      ? new Date(post.publishedAt).toISOString().split("T")[0]
      : currentDate;

    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${postDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>";

  return xml;
}
