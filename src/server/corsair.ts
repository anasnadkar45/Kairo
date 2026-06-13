import 'dotenv/config';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { Pool } from 'pg';
import { createCorsair } from 'corsair';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
// your app tables

export const corsair = createCorsair({
    plugins: [gmail(), googlecalendar()],
    database: pool,
    kek: process.env.CORSAIR_KEK!,
    multiTenancy: true,
});