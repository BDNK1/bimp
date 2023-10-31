CREATE TABLE IF NOT EXISTS "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(256),
	"file_path" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"accountId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
