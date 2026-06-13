import "dotenv/config";

import { setupCorsair } from "corsair";
import { corsair } from "../server/corsair";

async function main() {
    const tenantId = "user_123";

    const log = await setupCorsair(corsair, {
        tenantId,
    });

    console.log(log);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});