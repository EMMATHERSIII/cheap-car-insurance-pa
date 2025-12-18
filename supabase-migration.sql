-- Supabase PostgreSQL Schema Migration
-- This script creates all tables needed for the backup website

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "lastSignedIn" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  "coverImage" VARCHAR(500),
  category VARCHAR(100),
  tags TEXT,
  "metaTitle" VARCHAR(200),
  "metaDescription" TEXT,
  status VARCHAR(20) DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'published')),
  "authorId" INTEGER REFERENCES users(id),
  "publishedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(300),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'read', 'replied')),
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  age INTEGER NOT NULL,
  state VARCHAR(2) NOT NULL,
  "zipCode" VARCHAR(10) NOT NULL,
  "vehicleType" VARCHAR(100) NOT NULL,
  "vehicleYear" INTEGER NOT NULL,
  "hasRecentAccidents" VARCHAR(20) NOT NULL CHECK ("hasRecentAccidents" IN ('yes', 'no')),
  "currentInsurer" VARCHAR(200) NOT NULL,
  "coverageType" VARCHAR(100) NOT NULL,
  "ownershipStatus" VARCHAR(20) NOT NULL CHECK ("ownershipStatus" IN ('financed', 'owned', 'leased')),
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  referrer TEXT,
  "utmSource" VARCHAR(200),
  "utmMedium" VARCHAR(200),
  "utmCampaign" VARCHAR(200),
  status VARCHAR(20) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'sent', 'failed')),
  "sentToNetwork" VARCHAR(200),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create express_leads table
CREATE TABLE IF NOT EXISTS express_leads (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  state VARCHAR(2) NOT NULL,
  "zipCode" VARCHAR(10) NOT NULL,
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  referrer TEXT,
  "utmSource" VARCHAR(200),
  "utmMedium" VARCHAR(200),
  "utmCampaign" VARCHAR(200),
  status VARCHAR(20) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'sent', 'failed')),
  "sentToNetwork" VARCHAR(200),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create ab_test_variants table
CREATE TABLE IF NOT EXISTS ab_test_variants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  "variantA" TEXT NOT NULL,
  "variantB" TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create ab_test_events table
CREATE TABLE IF NOT EXISTS ab_test_events (
  id SERIAL PRIMARY KEY,
  "variantId" INTEGER NOT NULL REFERENCES ab_test_variants(id),
  "selectedVariant" VARCHAR(20) NOT NULL CHECK ("selectedVariant" IN ('A', 'B')),
  "eventType" VARCHAR(50) NOT NULL,
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_express_leads_email ON express_leads(email);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_users_openid ON users("openId");
