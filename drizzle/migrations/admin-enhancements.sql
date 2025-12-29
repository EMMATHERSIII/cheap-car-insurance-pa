-- Admin Portal Enhancements Migration
-- This migration adds new tables and enhances existing ones for the admin portal

-- Add new columns to existing tables
ALTER TABLE `users` 
  ADD COLUMN `isActive` ENUM('yes', 'no') NOT NULL DEFAULT 'yes' AFTER `role`,
  MODIFY COLUMN `role` ENUM('user', 'admin', 'manager') NOT NULL DEFAULT 'user';

ALTER TABLE `blog_posts` 
  ADD COLUMN `viewCount` INT NOT NULL DEFAULT 0 AFTER `publishedAt`,
  ADD COLUMN `deletedAt` TIMESTAMP NULL AFTER `viewCount`,
  MODIFY COLUMN `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft';

ALTER TABLE `contact_messages` 
  ADD COLUMN `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium' AFTER `status`,
  ADD COLUMN `assignedTo` INT NULL AFTER `priority`,
  ADD COLUMN `notes` TEXT NULL AFTER `assignedTo`,
  ADD COLUMN `deletedAt` TIMESTAMP NULL AFTER `notes`,
  MODIFY COLUMN `status` ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
  ADD FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`);

ALTER TABLE `leads` 
  ADD COLUMN `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium' AFTER `status`,
  ADD COLUMN `assignedTo` INT NULL AFTER `priority`,
  ADD COLUMN `estimatedValue` DECIMAL(10, 2) NULL AFTER `sentAt`,
  ADD COLUMN `deletedAt` TIMESTAMP NULL AFTER `estimatedValue`,
  MODIFY COLUMN `status` ENUM('new', 'sent', 'failed', 'contacted', 'converted', 'archived') NOT NULL DEFAULT 'new',
  ADD FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`);

ALTER TABLE `express_leads` 
  ADD COLUMN `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium' AFTER `status`,
  ADD COLUMN `assignedTo` INT NULL AFTER `priority`,
  ADD COLUMN `deletedAt` TIMESTAMP NULL AFTER `notes`,
  MODIFY COLUMN `status` ENUM('new', 'contacted', 'converted', 'archived') NOT NULL DEFAULT 'new',
  ADD FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`);

-- Create new tables

-- Lead notes table
CREATE TABLE IF NOT EXISTS `lead_notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `leadId` INT NULL,
  `expressLeadId` INT NULL,
  `userId` INT NOT NULL,
  `noteType` ENUM('call', 'email', 'sms', 'meeting', 'general') NOT NULL DEFAULT 'general',
  `content` TEXT NOT NULL,
  `isImportant` ENUM('yes', 'no') NOT NULL DEFAULT 'no',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`expressLeadId`) REFERENCES `express_leads`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_leadId` (`leadId`),
  INDEX `idx_expressLeadId` (`expressLeadId`),
  INDEX `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin activity logs table
CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entityType` VARCHAR(50) NOT NULL,
  `entityId` INT NULL,
  `details` TEXT NULL,
  `ipAddress` VARCHAR(45) NULL,
  `userAgent` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_entityType` (`entityType`),
  INDEX `idx_action` (`action`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email templates table
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL UNIQUE,
  `subject` VARCHAR(300) NOT NULL,
  `htmlContent` TEXT NOT NULL,
  `textContent` TEXT NULL,
  `variables` TEXT NULL,
  `isActive` ENUM('yes', 'no') NOT NULL DEFAULT 'yes',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_name` (`name`),
  INDEX `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System settings table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(50) NOT NULL,
  `dataType` ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
  `isPublic` ENUM('yes', 'no') NOT NULL DEFAULT 'no',
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`key`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bulk import jobs table
CREATE TABLE IF NOT EXISTS `import_jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `entityType` VARCHAR(50) NOT NULL,
  `fileName` VARCHAR(300) NOT NULL,
  `status` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  `totalRows` INT NOT NULL DEFAULT 0,
  `processedRows` INT NOT NULL DEFAULT 0,
  `successRows` INT NOT NULL DEFAULT 0,
  `failedRows` INT NOT NULL DEFAULT 0,
  `errorLog` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completedAt` TIMESTAMP NULL,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_entityType` (`entityType`),
  INDEX `idx_status` (`status`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default email templates
INSERT INTO `email_templates` (`name`, `subject`, `htmlContent`, `textContent`, `variables`, `isActive`) VALUES
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
'["name", "email"]', 'yes');

-- Insert default system settings
INSERT INTO `settings` (`key`, `value`, `description`, `category`, `dataType`, `isPublic`) VALUES
('site_name', 'Cheap Car Insurance PA', 'Website name', 'general', 'string', 'yes'),
('admin_email', 'admin@cheapcarinsurancepa.com', 'Primary admin email address', 'email', 'string', 'no'),
('leads_per_page', '50', 'Number of leads to display per page in admin', 'admin', 'number', 'no'),
('auto_archive_days', '90', 'Number of days before leads are auto-archived', 'automation', 'number', 'no'),
('enable_telegram_notifications', 'yes', 'Enable Telegram notifications for new leads', 'notifications', 'boolean', 'no'),
('enable_email_notifications', 'yes', 'Enable email notifications for new leads', 'notifications', 'boolean', 'no'),
('max_bulk_import_rows', '1000', 'Maximum number of rows allowed in bulk import', 'admin', 'number', 'no');

-- Create indexes for better performance
CREATE INDEX `idx_leads_status` ON `leads`(`status`);
CREATE INDEX `idx_leads_createdAt` ON `leads`(`createdAt`);
CREATE INDEX `idx_leads_email` ON `leads`(`email`);
CREATE INDEX `idx_leads_assignedTo` ON `leads`(`assignedTo`);
CREATE INDEX `idx_leads_deletedAt` ON `leads`(`deletedAt`);

CREATE INDEX `idx_express_leads_status` ON `express_leads`(`status`);
CREATE INDEX `idx_express_leads_createdAt` ON `express_leads`(`createdAt`);
CREATE INDEX `idx_express_leads_email` ON `express_leads`(`email`);
CREATE INDEX `idx_express_leads_assignedTo` ON `express_leads`(`assignedTo`);
CREATE INDEX `idx_express_leads_deletedAt` ON `express_leads`(`deletedAt`);

CREATE INDEX `idx_contact_messages_status` ON `contact_messages`(`status`);
CREATE INDEX `idx_contact_messages_createdAt` ON `contact_messages`(`createdAt`);
CREATE INDEX `idx_contact_messages_assignedTo` ON `contact_messages`(`assignedTo`);
CREATE INDEX `idx_contact_messages_deletedAt` ON `contact_messages`(`deletedAt`);

CREATE INDEX `idx_blog_posts_status` ON `blog_posts`(`status`);
CREATE INDEX `idx_blog_posts_deletedAt` ON `blog_posts`(`deletedAt`);
