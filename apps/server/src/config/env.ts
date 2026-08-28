export const env = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  AISENSY_API_KEY: process.env.AISENSY_API_KEY as string,
  AISENSY_PROJECT_ID: process.env.AISENSY_PROJECT_ID as string,
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN || 'hotelpipe_secure_token',
  PORT: process.env.PORT || 3000,
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
};

if (!env.GEMINI_API_KEY || !env.AISENSY_API_KEY || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing critical API keys in environment variables.");
}