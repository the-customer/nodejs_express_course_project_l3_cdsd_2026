export function requireJSON(req, res, next) {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
        return res.status(415).json({
            error: "Unsupported Content-Type, excepted json"
        });
    }
    next();
}