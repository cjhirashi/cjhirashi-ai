import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { agentType } from "./schema";

config({
  path: ".env.local",
});

const seedAgentTypes = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Seeding agent types...");

  const agentTypes = [
    {
      id: "chat-general",
      name: "General Chat",
      description:
        "Standard conversational agent for general-purpose interactions",
      isActive: true,
    },
    {
      id: "multi-tools",
      name: "Multi-Tools Agent",
      description:
        "Agent with access to multiple tools for complex task execution",
      isActive: true,
    },
    {
      id: "rag",
      name: "RAG Agent",
      description:
        "Retrieval-Augmented Generation agent for knowledge-based queries",
      isActive: true,
    },
    {
      id: "multi-agent",
      name: "Multi-Agent System",
      description:
        "Orchestrates multiple specialized agents for collaborative problem-solving",
      isActive: true,
    },
  ];

  try {
    const start = Date.now();

    for (const type of agentTypes) {
      await db
        .insert(agentType)
        .values(type)
        .onConflictDoNothing({ target: agentType.id });
    }

    const end = Date.now();

    console.log(
      `✅ Seeded ${agentTypes.length} agent types in ${end - start}ms`
    );
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed");
    console.error(err);
    await connection.end();
    process.exit(1);
  }
};

seedAgentTypes().catch((err) => {
  console.error("❌ Seeding failed");
  console.error(err);
  process.exit(1);
});
