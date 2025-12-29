-- Admin Portal Enhancements Migration for PostgreSQL

-- Create ENUM types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE yes_no AS ENUM ('yes', 'no');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('new', 'read', 'replied', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('new', 'sent', 'failed', 'contacted', 'converted', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE express_lead_status AS ENUM ('new', 'contacted', 'converted', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE note_type AS ENUM ('call', 'email', 'sms', 'meeting', 'general');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE data_type AS ENUM ('string', 'number', 'boolean', 'json');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing tables
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isActive" yes_no DEFAULT 'yes';
-- Role update might need casting
ALTER TABLE "users" ALTER COLUMN "role" TYPE user_role USING "role"::user_role;

ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER DEFAULT 0;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "blog_posts" ALTER COLUMN "status" TYPE blog_status USING "status"::blog_status;

ALTER TABLE "contact_messages" ADD COLUMN IF NOT EXISTS "priority" priority_level DEFAULT 'medium';
ALTER TABLE "contact_messages" ADD COLUMN IF NOT EXISTS "assignedTo" INTEGER;
ALTER TABLE "contact_messages" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "contact_messages" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "contact_messages" ALTER COLUMN "status" TYPE message_status USING "status"::message_status;
ALTER TABLE "contact_messages" ADD CONSTRAINT fk_contact_assigned FOREIGN KEY ("assignedTo") REFERENCES "users"("id");

ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "priority" priority_level DEFAULT 'medium';
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "assignedTo" INTEGER;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "estimatedValue" DECIMAL(10, 2);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "leads" ALTER COLUMN "status" TYPE lead_status USING "status"::lead_status;
ALTER TABLE "leads" ADD CONSTRAINT fk_leads_assigned FOREIGN KEY ("assignedTo") REFERENCES "users"("id");

ALTER TABLE "express_leads" ADD COLUMN IF NOT EXISTS "priority" priority_level DEFAULT 'medium';
ALTER TABLE "express_leads" ADD COLUMN IF NOT EXISTS "assignedTo" INTEGER;
ALTER TABLE "express_leads" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "express_leads" ALTER COLUMN "status" TYPE express_lead_status USING "status"::express_lead_status;
ALTER TABLE "express_leads" ADD CONSTRAINT fk_express_assigned FOREIGN KEY ("assignedTo") REFERENCES "users"("id");

-- Create new tables

-- Lead notes table
CREATE TABLE IF NOT EXISTS "lead_notes" (
  "id" SERIAL PRIMARY KEY,
  "leadId" INTEGER REFERENCES "leads"("id") ON DELETE CASCADE,
  "expressLeadId" INTEGER REFERENCES "express_leads"("id") ON DELETE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "noteType" note_type DEFAULT 'general',
  "content" TEXT NOT NULL,
  "isImportant" yes_no DEFAULT 'no',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity logs table
CREATE TABLE IF NOT EXISTS "admin_activity_logs" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "action" VARCHAR(100) NOT NULL,
  "entityType" VARCHAR(50) NOT NULL,
  "entityId" INTEGER,
  "details" TEXT,
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email templates table
CREATE TABLE IF NOT EXISTS "email_templates" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(200) NOT NULL UNIQUE,
  "subject" VARCHAR(300) NOT NULL,
  "htmlContent" TEXT NOT NULL,
  "textContent" TEXT,
  "variables" TEXT,
  "isActive" yes_no DEFAULT 'yes',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE IF NOT EXISTS "settings" (
  "id" SERIAL PRIMARY KEY,
  "key" VARCHAR(100) NOT NULL UNIQUE,
  "value" TEXT NOT NULL,
  "description" TEXT,
  "category" VARCHAR(50) NOT NULL,
  "dataType" data_type DEFAULT 'string',
  "isPublic" yes_no DEFAULT 'no',
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bulk import jobs table
CREATE TABLE IF NOT EXISTS "import_jobs" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "entityType" VARCHAR(50) NOT NULL,
  "fileName" VARCHAR(300) NOT NULL,
  "status" job_status DEFAULT 'pending',
  "totalRows" INTEGER DEFAULT 0,
  "processedRows" INTEGER DEFAULT 0,
  "successRows" INTEGER DEFAULT 0,
  "failedRows" INTEGER DEFAULT 0,
  "errorLog" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP
);

-- Insert default email templates
INSERT INTO "email_templates" ("name", "subject", "htmlContent", "textContent", "variables", "isActive") VALUES
('lead_confirmation', 'Thank You for Your Quote Request', 
'<html><body><h1>Thank you, {{firstName}}!</h1><p>We received your insurance quote request and will contact you soon at {{email}} or {{phone}}.</p></body></html>',
'Thank you, {{firstName}}! We received your insurance quote request and will contact you soon at {{email}} or {{phone}}.',
'["firstName", "lastName", "email", "phone"]', 'yes'),

('express_lead_confirmation', 'We Will Call You Back Soon', 
'<html><body><h1>Thank you!</h1><p>We received your quick quote request. Our team will contact you at {{phone}} or {{email}} within 24 hours.</p></body></html>',
'Thank you! We received your quick quote request. Our team will contact you at {{phone}} or {{email}} within 24 hours.',
'["email", "phone"]', 'yes'),

('contact_confirmation', 'We Received Your Message', 
'<html><body><h1>Thank you, {{name}}!</h1><p>We received your message and will respond to you at {{email}} as soon as possible.</p></body></html>',
'Thank you, {{name}}! We received your message and will respond to you at {{email}} as soon as possible.',
'["name", "email"]', 'yes')
ON CONFLICT ("name") DO NOTHING;

-- Insert default system settings
INSERT INTO "settings" ("key", "value", "description", "category", "dataType", "isPublic") VALUES
('site_name', 'Cheap Car Insurance PA', 'Website name', 'general', 'string', 'yes'),
('admin_email', 'admin@cheapcarinsurancepa.com', 'Primary admin email address', 'email', 'string', 'no'),
('leads_per_page', '50', 'Number of leads to display per page in admin', 'admin', 'number', 'no'),
('auto_archive_days', '90', 'Number of days before leads are auto-archived', 'automation', 'number', 'no'),
('enable_telegram_notifications', 'yes', 'Enable Telegram notifications for new leads', 'notifications', 'boolean', 'no'),
('enable_email_notifications', 'yes', 'Enable email notifications for new leads', 'notifications', 'boolean', 'no'),
('max_bulk_import_rows', '1000', 'Maximum number of rows allowed in bulk import', 'admin', 'number', 'no')
ON CONFLICT ("key") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON "leads"("status");
CREATE INDEX IF NOT EXISTS idx_leads_createdAt ON "leads"("createdAt");
CREATE INDEX IF NOT EXISTS idx_leads_email ON "leads"("email");
CREATE INDEX IF NOT EXISTS idx_leads_deletedAt ON "leads"("deletedAt");

CREATE INDEX IF NOT EXISTS idx_express_leads_status ON "express_leads"("status");
CREATE INDEX IF NOT EXISTS idx_express_leads_createdAt ON "express_leads"("createdAt");
CREATE INDEX IF NOT EXISTS idx_express_leads_email ON "express_leads"("email");
CREATE INDEX IF NOT EXISTS idx_express_leads_deletedAt ON "express_leads"("deletedAt");

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON "contact_messages"("status");
CREATE INDEX IF NOT EXISTS idx_contact_messages_createdAt ON "contact_messages"("createdAt");
CREATE INDEX IF NOT EXISTS idx_contact_messages_deletedAt ON "contact_messages"("deletedAt");

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON "blog_posts"("status");
CREATE INDEX IF NOT EXISTS idx_blog_posts_deletedAt ON "blog_posts"("deletedAt");

-- Grant Admin role to the user
UPDATE "users" SET "role" = 'admin' WHERE "email" = 'emmathersiii@gmail.com';
