#!/usr/bin/env node
/**
 * Import blog articles from Excel file to database
 */
import { readFileSync } from 'fs';
import { read, utils } from 'xlsx';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blogPosts } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Load environment variables
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

// Helper functions
function cleanHtmlContent(content) {
  if (!content) return '';
  
  let cleaned = String(content);
  
  // Remove DOCTYPE
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
  
  // Extract body content if exists
  const bodyMatch = cleaned.match(/<body[^>]*>(.*?)<\/body>/is);
  if (bodyMatch) {
    cleaned = bodyMatch[1];
  } else {
    // Remove html, head, body tags
    cleaned = cleaned.replace(/<\/?html[^>]*>/gi, '');
    cleaned = cleaned.replace(/<head>.*?<\/head>/gis, '');
    cleaned = cleaned.replace(/<\/?body[^>]*>/gi, '');
  }
  
  return cleaned.trim();
}

function extractTextFromHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').trim();
}

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Main import function
async function importArticles() {
  console.log('Loading Excel file...\n');
  
  // Read Excel file
  const workbook = read(readFileSync('/home/ubuntu/upload/car_insurance_articles_100_images.xlsx'));
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = utils.sheet_to_json(worksheet);
  
  console.log(`Found ${data.length} articles to import\n`);
  
  // Connect to database
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const row of data) {
    try {
      const title = row['Title'];
      const slug = row['Slug'];
      const content = cleanHtmlContent(row['Content']);
      const excerptRaw = row['Excerpt'];
      const category = row['Category'];
      const tags = row['Tags'];
      const metaTitle = truncate(row['Meta Title'], 60);
      const metaDescriptionRaw = row['Meta Description'];
      const imageFilename = row['Image URL'];
      
      // Extract text from HTML
      const excerpt = truncate(extractTextFromHtml(excerptRaw), 500);
      const metaDescription = truncate(extractTextFromHtml(metaDescriptionRaw), 160);
      
      // Build image URL
      const coverImage = imageFilename ? `/images/blog/${imageFilename}` : null;
      
      // Check if article already exists
      const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      if (existing.length > 0) {
        console.log(`⏭️  Skipping (exists): ${title.substring(0, 50)}...`);
        skipped++;
        continue;
      }
      
      // Insert article
      await db.insert(blogPosts).values({
        title,
        slug,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        metaTitle,
        metaDescription,
        status: 'published',
        publishedAt: new Date(),
      });
      
      console.log(`✅ Imported: ${title.substring(0, 60)}...`);
      imported++;
      
    } catch (error) {
      console.error(`❌ Error importing article: ${error.message.substring(0, 100)}`);
      errors++;
    }
  }
  
  await connection.end();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('Import completed!');
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`${'='.repeat(60)}`);
}

// Run import
importArticles().catch(console.error);
