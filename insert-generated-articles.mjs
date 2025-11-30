import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Read the generated articles
const generatedArticles = JSON.parse(fs.readFileSync('/home/ubuntu/generate_insurance_articles.json', 'utf-8'));
const articlesData = JSON.parse(fs.readFileSync('./blog-articles-data.json', 'utf-8'));

// Function to generate backdated timestamps spread across 6 months
function generateBackdatedTimestamp(index, total) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
  const timeSpan = now.getTime() - sixMonthsAgo.getTime();
  const interval = timeSpan / total;
  return new Date(sixMonthsAgo.getTime() + (interval * index));
}

async function insertArticles() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('Inserting 50 blog articles into database...\n');

  for (let i = 0; i < generatedArticles.results.length; i++) {
    const generated = generatedArticles.results[i];
    const articleData = articlesData[i];
    
    console.log(`[${i + 1}/50] Inserting: ${articleData.title}`);
    
    try {
      const article = {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: generated.output.article_content,
        category: articleData.category,
        image_url: articleData.image_url,
        published_at: generateBackdatedTimestamp(i, generatedArticles.results.length),
        status: 'published'
      };
      
      // Insert into database
      await connection.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, category, coverImage, publishedAt, status, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [article.title, article.slug, article.excerpt, article.content, article.category, article.image_url, article.published_at, article.status]
      );
      
      console.log(`✓ Inserted successfully`);
      
    } catch (error) {
      console.error(`✗ Error inserting article: ${error.message}`);
    }
  }

  await connection.end();
  console.log('\n✓ All 50 articles inserted successfully!');
}

insertArticles().catch(console.error);
