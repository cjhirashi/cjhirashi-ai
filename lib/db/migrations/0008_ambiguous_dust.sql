CREATE TABLE IF NOT EXISTS "AgentType" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StoredFile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"fileName" text NOT NULL,
	"fileSize" integer NOT NULL,
	"fileType" text NOT NULL,
	"fileUrl" text NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TodoItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"priority" varchar DEFAULT 'medium' NOT NULL,
	"dueDate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserMessage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"senderId" uuid NOT NULL,
	"recipientId" uuid NOT NULL,
	"content" text NOT NULL,
	"attachments" jsonb,
	"isRead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "agentType" varchar(50) DEFAULT 'chat-general' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StoredFile" ADD CONSTRAINT "StoredFile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_senderId_User_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_recipientId_User_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "StoredFile_userId_idx" ON "StoredFile" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TodoItem_userId_completed_idx" ON "TodoItem" USING btree ("userId","completed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "UserMessage_senderId_recipientId_idx" ON "UserMessage" USING btree ("senderId","recipientId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Chat_userId_agentType_idx" ON "Chat" USING btree ("userId","agentType");