import { useEffect } from "react";

interface SchemaProps {
  type: "organization" | "article" | "faq" | "localBusiness" | "breadcrumb";
  data: any;
}

export function Schema({ type, data }: SchemaProps) {
  useEffect(() => {
    let schema: any = {};

    switch (type) {
      case "organization":
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CheapCarInsurancePennsylvania.com",
          url: "https://cheapcarinsurancepennsylvania.com",
          logo: "https://cheapcarinsurancepennsylvania.com/logo.png",
          description: "Pennsylvania's trusted car insurance comparison and lead generation service. Compare quotes from top providers and save money on auto insurance.",
          address: {
            "@type": "PostalAddress",
            addressRegion: "PA",
            addressCountry: "US",
          },
          contactPoint: {
            "@type": "ContactPoint",
            email: "info@cheapcarinsurancepennsylvania.com",
            contactType: "Customer Service",
          },
          sameAs: [
            "https://www.facebook.com/cheapcarinsurancepa",
            "https://twitter.com/cheapcarinspa",
          ],
        };
        break;

      case "article":
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.excerpt || data.metaDescription,
          image: data.coverImage || "https://cheapcarinsurancepennsylvania.com/og-image.jpg",
          datePublished: data.publishedAt,
          dateModified: data.updatedAt || data.publishedAt,
          author: {
            "@type": "Organization",
            name: "CheapCarInsurancePennsylvania.com",
          },
          publisher: {
            "@type": "Organization",
            name: "CheapCarInsurancePennsylvania.com",
            logo: {
              "@type": "ImageObject",
              url: "https://cheapcarinsurancepennsylvania.com/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://cheapcarinsurancepennsylvania.com/blog/${data.slug}`,
          },
        };
        break;

      case "faq":
        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.questions.map((q: { question: string; answer: string }) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer,
            },
          })),
        };
        break;

      case "localBusiness":
        schema = {
          "@context": "https://schema.org",
          "@type": "FinancialService",
          name: "CheapCarInsurancePennsylvania.com",
          description: "Car insurance comparison and lead generation service serving Pennsylvania drivers",
          url: "https://cheapcarinsurancepennsylvania.com",
          telephone: "+1-XXX-XXX-XXXX",
          email: "info@cheapcarinsurancepennsylvania.com",
          address: {
            "@type": "PostalAddress",
            addressRegion: "PA",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "40.2732",
            longitude: "-76.8867",
          },
          areaServed: {
            "@type": "State",
            name: "Pennsylvania",
          },
          priceRange: "$$",
          openingHours: "Mo-Fr 09:00-17:00",
        };
        break;

      case "breadcrumb":
        schema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.items.map((item: { name: string; url: string }, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `https://cheapcarinsurancepennsylvania.com${item.url}`,
          })),
        };
        break;
    }

    // Add or update script tag
    const scriptId = `schema-${type}`;
    let scriptTag = document.getElementById(scriptId);

    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [type, data]);

  return null;
}
