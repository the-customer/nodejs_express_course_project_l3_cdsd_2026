export function rateLimiter({
    windowMs = 60000,
    maxRequests = 10,
    skip = () => false
} = {}) {
    const hits = new Map(); // ip -> {count,resetAt}
    return (req, res, next) => {
        //skip somes routes
        if (skip(req)) {
            return next();
        }
        // const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim()
        let ip = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0].trim() : undefined
        if (!ip) {
            ip = req.socket.remoteAddress || "unknown"
        }

        const now = Date.now();
        const entry = hits.get(ip)

        //init
        if (!entry || now > entry.resetAt) {
            hits.set(ip, {
                count: 1,
                resetAt: now + windowMs
            });
            next()
        }
        //increment
        entry.count += 1;

        //
        if (entry.count > maxRequests) {
            const retryAfterMs = entry.resetAt - now;
            const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

            res.setHeader("Retry-After", String(retryAfterSeconds));

            return res.status(429).json({
                error: "Too many request!",
                retryAfterSeconds,
                limit: maxRequests,
                windowSeconds: Math.ceil(windowMs / 1000)
            });
        }
        next();
    }
}