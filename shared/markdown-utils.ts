/**
 * Add IDs to headings in markdown content for TOC linking
 */
export function addHeadingIds(content: string): string {
  let headingIndex = 0;
  
  return content.replace(/^(#{2,3})\s+(.+)$/gm, (match, hashes, text) => {
    const id = `heading-${headingIndex}`;
    headingIndex++;
    
    // Return heading with ID attribute (will be rendered in HTML)
    return `${hashes} ${text} {#${id}}`;
  });
}

/**
 * Convert markdown to HTML with heading IDs
 * Simple converter for headings, paragraphs, bold, italic, links
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;
  let headingIndex = 0;

  // Convert headings with IDs
  html = html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    const level = hashes.length;
    const id = level >= 2 && level <= 3 ? `heading-${headingIndex++}` : "";
    const idAttr = id ? ` id="${id}"` : "";
    return `<h${level}${idAttr}>${text}</h${level}>`;
  });

  // Convert bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  
  // Convert italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  
  // Convert links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  
  // Convert paragraphs (double line breaks)
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h\d)/g, "$1");
  html = html.replace(/(<\/h\d>)<\/p>/g, "$1");
  
  return html;
}
