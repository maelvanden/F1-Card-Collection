export function getAllowedOrigins(env = process.env.ALLOWED_ORIGINS) {
  return env
    ? env
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : ['http://localhost:5173'];
}
