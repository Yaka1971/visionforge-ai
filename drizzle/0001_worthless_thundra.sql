CREATE TABLE `galleryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`generationId` int NOT NULL,
	`type` enum('image','video') NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`thumbnail` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('image','video') NOT NULL,
	`prompt` text NOT NULL,
	`negativePrompt` text,
	`style` varchar(64),
	`aspectRatio` varchar(16),
	`imageUrl` text,
	`imageFileKey` varchar(255),
	`videoUrl` text,
	`videoFileKey` varchar(255),
	`metadata` text,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generations_id` PRIMARY KEY(`id`)
);
