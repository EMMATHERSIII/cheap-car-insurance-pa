import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import { readFileSync } from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Read article files
const article1 = readFileSync('./winter-article-1.md', 'utf-8');
const article2 = readFileSync('./winter-article-2.md', 'utf-8');
const article3 = readFileSync('./winter-article-3.md', 'utf-8');
const article4 = readFileSync('./winter-article-4.md', 'utf-8');

// Helper function to extract title and content from markdown
function parseArticle(markdown) {
  const lines = markdown.split('\n');
  const title = lines[0].replace(/^#\s+/, '').trim();
  
  // Find category line
  let category = 'General';
  const categoryLine = lines.find(line => line.startsWith('**Category:**'));
  if (categoryLine) {
    category = categoryLine.replace('**Category:**', '').trim();
  }
  
  // Remove title, category, published date, and separator lines from content
  const contentStart = lines.findIndex((line, idx) => 
    idx > 0 && line.trim() === '---' && lines[idx + 1] && lines[idx + 1].trim() !== ''
  );
  
  const content = lines.slice(contentStart + 2).join('\n').trim();
  
  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return { title, category, content, slug };
}

// Parse all articles
const articles = [
  { ...parseArticle(article1), publishTime: '08:00:00' },
  { ...parseArticle(article2), publishTime: '12:00:00' },
  { ...parseArticle(article3), publishTime: '16:00:00' },
  { ...parseArticle(article4), publishTime: '20:00:00' },
];

// Get today's date
const today = new Date();
const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

// Insert articles
for (const article of articles) {
  const publishedAt = new Date(`${dateStr}T${article.publishTime}`);
  
  await db.insert(schema.blogPosts).values({
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.content.substring(0, 200) + '...',
    category: article.category,
    author: 'Insurance Expert',
    publishedAt,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  });
  
  console.log(`✅ Inserted: ${article.title} (${article.publishTime})`);
}

console.log('\n✅ All 4 winter articles inserted successfully!');

await connection.end();
