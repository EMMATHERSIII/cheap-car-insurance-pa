/**
 * Extract FAQ items from blog post content
 * Looks for patterns like:
 * - ## Question? or ### Question?
 * - **Question?** followed by answer
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export function extractFAQsFromContent(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Pattern 1: Markdown headers ending with "?"
  // Example: ## How much does car insurance cost in PA?
  const headerPattern = /^#{2,3}\s+(.+\?)\s*$/gm;
  const matches = Array.from(content.matchAll(headerPattern));
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const question = match[1].trim();
    const questionIndex = match.index!;
    
    // Find the next header or end of content
    const nextMatch = matches[i + 1];
    const nextIndex = nextMatch ? nextMatch.index! : content.length;
    
    // Extract answer (text between this header and next header)
    let answer = content.substring(questionIndex + match[0].length, nextIndex).trim();
    
    // Remove markdown formatting and clean up
    answer = answer
      .replace(/^#{1,6}\s+/gm, '') // Remove other headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim();
    
    // Only add if answer is not too short and not too long
    if (answer.length > 20 && answer.length < 500) {
      faqs.push({ question, answer });
    }
  }
  
  // Pattern 2: Bold questions
  // Example: **How much does car insurance cost?** Answer text here.
  const boldPattern = /\*\*(.+\?)\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/g;
  const boldMatches = Array.from(content.matchAll(boldPattern));
  
  for (const match of boldMatches) {
    const question = match[1].trim();
    let answer = match[2].trim();
    
    // Clean up answer
    answer = answer
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim();
    
    // Avoid duplicates
    const isDuplicate = faqs.some(faq => faq.question === question);
    
    if (!isDuplicate && answer.length > 20 && answer.length < 500) {
      faqs.push({ question, answer });
    }
  }
  
  // Return up to 5 FAQs
  return faqs.slice(0, 5);
}

/**
 * Generate FAQ Schema markup
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  if (faqs.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Check if content has FAQ-like structure
 */
export function hasFAQStructure(content: string): boolean {
  // Check for questions (headers or bold text ending with ?)
  const questionPattern = /(^#{2,3}\s+.+\?|^\*\*.+\?\*\*)/gm;
  const matches = content.match(questionPattern);
  return matches !== null && matches.length >= 2;
}
