import "dotenv/config";

import { setupCorsair } from "corsair";
import { corsair } from "../server/corsair";

async function main() {
  const redirectUrl = `${process.env.APP_URL}/api/corsair/callback`;

  if (!process.env.BETTER_AUTH_GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is missing");
  }

  if (!process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is missing");
  }

  if (!process.env.APP_URL) {
    throw new Error("APP_URL is missing");
  }

  console.log("Setting Corsair redirect URL:", redirectUrl);

  // Creates CorsairIntegration rows
  const setupLog = await setupCorsair(corsair);
  console.log(setupLog);

  // Set Gmail OAuth app credentials
  await corsair.keys.gmail.set_client_id(process.env.BETTER_AUTH_GOOGLE_CLIENT_ID);
  await corsair.keys.gmail.set_client_secret(process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET);

  // Set Google Calendar OAuth app credentials
  await corsair.keys.googlecalendar.set_client_id(process.env.BETTER_AUTH_GOOGLE_CLIENT_ID);
  await corsair.keys.googlecalendar.set_client_secret(
    process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET
  );

  // If your Corsair version supports redirect_url key setters, keep these.
  // If TypeScript errors, remove these two lines.
  await corsair.keys.gmail.set_redirect_url?.(redirectUrl);
  await corsair.keys.googlecalendar.set_redirect_url?.(redirectUrl);

  console.log("Corsair integration credentials configured successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});