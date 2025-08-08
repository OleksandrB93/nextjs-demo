export function getAuthConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const vercelUrl = process.env.VERCEL_URL;

  let nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!nextAuthUrl) {
    if (isProduction && vercelUrl) {
      nextAuthUrl = `https://${vercelUrl}`;
    } else {
      nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    }
  }

  return {
    nextAuthUrl,
    isProduction,
  };
}
