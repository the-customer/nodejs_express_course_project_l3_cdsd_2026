export function authMock(requireRole = null) {
    return (req, res, next) => {
        const role = req.headers["x-user-role"];
        if (!role) {
            return res.status(401).json({
                error: "Unauthenticated"
            })
        }

        req.user = {
            id: 1,
            role,
            name: role === "ADMIN" ? "Admin User" : "Standard User"
        };

        if (requireRole !== null && role !== requireRole) {
            return res.status(403).json({
                error: "forbidden"
            })
        }

        next()
    }
}

// function somme2(x, y) {
//     return x + y
// }

// function somme3(a, b, c) {
//     return somme2(a,b) + c;
// }
authMock("ADMIN")
authMock()