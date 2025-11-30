import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blogPosts } from './drizzle/schema.js';
import { invokeLLM } from './server/_core/llm.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const articlesData = JSON.parse(fs.readFileSync('./blog-articles-data.json', 'utf-8'));

// Function to generate backdated timestamps spread across 6 months
function generateBackdatedTimestamp(index, total) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
  const timeSpan = now.getTime() - sixMonthsAgo.getTime();
  const interval = timeSpan / total;
  return new Date(sixMonthsAgo.getTime() + (interval * index));
}

// Function to generate article content using LLM
async function generateArticleContent(articleData) {
  const prompt = `Write a comprehensive, SEO-optimized blog article about "${articleData.title}".

Requirements:
- Length: 1000-1200 words
- Format: HTML with proper semantic tags (h2, h3, p, ul, ol)
- Include 4-6 H2 headings for main sections
- Include 2-3 H3 subheadings under some H2 sections
- Write in a professional, informative tone
- Target keywords: ${articleData.keywords.join(', ')}
- Focus on Pennsylvania when relevant
- Include practical, actionable advice
- Add a conclusion section

Structure:
1. Introduction paragraph (2-3 sentences)
2. Main content sections with H2 headings
3. Conclusion paragraph

Do NOT include the article title as H1 - start directly with introduction paragraph.
Use only HTML tags: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>`;

  const response = await invokeLLM({
    messages: [
      { role: 'system', content: 'You are an expert insurance content writer specializing in car insurance topics.' },
      { role: 'user', content: prompt }
    ]
  });

  return response.choices[0].message.content;
}

async function insertArticles() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('Generating and inserting 50 blog articles...');
  console.log('This will take approximately 30-45 minutes.\n');

  for (let i = 0; i < articlesData.length; i++) {
    const articleData = articlesData[i];
    
    console.log(`[${i + 1}/50] Generating: ${articleData.title}`);
    
    try {
      // Generate article content
      const content = await generateArticleContent(articleData);
      
      // Prepare article for database
      const article = {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: content,
        category: articleData.category,
        image_url: articleData.image_url,
        published_at: generateBackdatedTimestamp(i, articlesData.length),
        status: 'published'
      };
      
      // Insert into database
      await db.insert(blogPosts).values(article);
      
      console.log(`✓ Inserted successfully\n`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`✗ Error generating article: ${error.message}\n`);
    }
  }

  await connection.end();
  console.log('\n✓ All 50 articles generated and inserted successfully!');
}

insertArticles().catch(console.error);
