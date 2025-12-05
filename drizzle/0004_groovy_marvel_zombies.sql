CREATE TABLE `express_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`referrer` text,
	`utmSource` varchar(200),
	`utmMedium` varchar(200),
	`utmCampaign` varchar(200),
	`status` enum('new','contacted','converted') NOT NULL DEFAULT 'new',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `express_leads_id` PRIMARY KEY(`id`)
);
