CREATE TABLE `ab_test_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variantId` int NOT NULL,
	`eventType` enum('view','conversion') NOT NULL,
	`sessionId` varchar(100) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`leadId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ab_test_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ab_test_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`headline` varchar(500) NOT NULL,
	`subheadline` text,
	`ctaText` varchar(100) NOT NULL,
	`description` text,
	`isActive` enum('yes','no') NOT NULL DEFAULT 'yes',
	`isDefault` enum('yes','no') NOT NULL DEFAULT 'no',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ab_test_variants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ab_test_events` ADD CONSTRAINT `ab_test_events_variantId_ab_test_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `ab_test_variants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ab_test_events` ADD CONSTRAINT `ab_test_events_leadId_leads_id_fk` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE no action ON UPDATE no action;