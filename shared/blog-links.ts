// Internal linking configuration for blog posts
// Maps each article to related articles for SEO

export interface RelatedArticle {
  slug: string;
  title: string;
}

// Category-based article groupings
export const articlesByCategory: Record<string, string[]> = {
  "Pennsylvania Laws": [
    "pennsylvania-minimum-insurance-requirements",
    "sr22-insurance-pennsylvania-guide",
    "pennsylvania-no-fault-insurance-explained",
    "pennsylvania-uninsured-motorist-coverage",
    "pennsylvania-car-insurance-laws-2024",
  ],
  "Money Saving Tips": [
    "how-to-lower-car-insurance-costs-pennsylvania",
    "top-insurance-discounts-you-might-miss",
    "bundling-insurance-policies-save-money",
    "pay-per-mile-insurance-worth-it",
    "usage-based-insurance-pros-cons",
  ],
  "Driver Demographics": [
    "best-insurance-young-drivers-pennsylvania",
    "car-insurance-seniors-pennsylvania",
    "first-time-car-buyers-insurance-guide",
    "teen-driver-insurance-tips-parents",
  ],
  "Claims & Accidents": [
    "what-to-do-after-car-accident-pennsylvania",
    "filing-car-insurance-claim-step-by-step",
    "how-accidents-affect-insurance-rates",
    "dealing-with-hit-and-run-pennsylvania",
  ],
  "Coverage Types": [
    "comprehensive-vs-collision-coverage-explained",
    "full-coverage-vs-liability-only-insurance",
    "gap-insurance-explained-need-it",
    "rental-car-insurance-coverage-explained",
    "umbrella-insurance-car-owners",
  ],
  "Insurance Basics": [
    "credit-score-affects-insurance-rates",
    "understanding-car-insurance-deductibles",
    "how-insurance-companies-calculate-rates",
    "reading-understanding-insurance-policy",
    "car-insurance-myths-debunked",
  ],
  "Vehicle Types": [
    "insuring-electric-vehicles-pennsylvania",
    "classic-car-insurance-pennsylvania",
    "motorcycle-insurance-pennsylvania-guide",
    "commercial-vehicle-insurance-small-business",
  ],
  "Comparison Guides": [
    "top-car-insurance-companies-pennsylvania",
    "geico-vs-state-farm-pennsylvania",
    "progressive-vs-allstate-comparison",
    "local-vs-national-insurance-companies",
  ],
};

// Get related articles for a specific post
export function getRelatedArticles(currentSlug: string, allPosts: Array<{ slug: string; title: string; category: string | null }>): RelatedArticle[] {
  const currentPost = allPosts.find(p => p.slug === currentSlug);
  if (!currentPost) return [];

  const related: RelatedArticle[] = [];
  
  // First, add articles from the same category
  if (currentPost.category && articlesByCategory[currentPost.category]) {
    const categoryArticles = articlesByCategory[currentPost.category]
      .filter(slug => slug !== currentSlug)
      .slice(0, 3);
    
    for (const slug of categoryArticles) {
      const post = allPosts.find(p => p.slug === slug);
      if (post) {
        related.push({ slug: post.slug, title: post.title });
      }
    }
  }

  // If we need more articles, add from other categories
  if (related.length < 3) {
    const otherArticles = allPosts
      .filter(p => p.slug !== currentSlug && !related.find(r => r.slug === p.slug))
      .slice(0, 3 - related.length);
    
    for (const post of otherArticles) {
      related.push({ slug: post.slug, title: post.title });
    }
  }

  return related.slice(0, 3);
}

// Get internal links to add within article content
export function getInternalLinksForArticle(currentSlug: string, allPosts: Array<{ slug: string; title: string; category: string | null }>): Array<{ text: string; url: string }> {
  const currentPost = allPosts.find(p => p.slug === currentSlug);
  if (!currentPost) return [];

  const links: Array<{ text: string; url: string }> = [];
  
  // Get articles from same category
  if (currentPost.category && articlesByCategory[currentPost.category]) {
    const categoryArticles = articlesByCategory[currentPost.category]
      .filter(slug => slug !== currentSlug)
      .slice(0, 5);
    
    for (const slug of categoryArticles) {
      const post = allPosts.find(p => p.slug === slug);
      if (post) {
        links.push({
          text: post.title,
          url: `/blog/${post.slug}`
        });
      }
    }
  }

  return links.slice(0, 5);
}
