export function getAuthConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const vercelUrl = process.env.VERCEL_URL;

  let nextAuthUrl = process.env.NEXTAUTH_URL;

  if (!nextAuthUrl) {
    if (isProduction && vercelUrl) {
      nextAuthUrl = `https://${vercelUrl}`;
    } else {
      nextAuthUrl = "http://localhost:3000";
    }
  }

  // Ensure we always use the correct URL for production
  if (isProduction && vercelUrl && !nextAuthUrl.includes(vercelUrl)) {
    nextAuthUrl = `https://${vercelUrl}`;
  }

  return {
    nextAuthUrl,
    isProduction,
  };
}
