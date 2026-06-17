import "dotenv/config";
import { setupCorsair } from "corsair";
import { corsair } from "@/lib/corsair";

async function main() {
  const log = await setupCorsair(corsair, {
    credentials: {
      gmail: {
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      googlecalendar: {
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
  });

  console.log(log);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});