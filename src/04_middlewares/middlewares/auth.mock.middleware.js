/**
 * 
 * @param {*} requireRole 
 * @returns 
 * Header expected:
 * x-user-role: ADMIN | USER
 * middleware factory
 */
export function authMock(requireRole = null) {
    return (req, res, next) => {
        // console.log(req.get("Content-Type"))
        console.log("content-type:", req.headers["content-type"])
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
// authMock("ADMIN")
// authMock()


/**
 * 1. Ajouter un middleware "requireJSON" (refuse si le Content-Type n'est pas du json)
 * 2. Ajouter un middleware "requestId" (ajouter un id a la requete : utiliser un uuid)
 * 3. Bloquer DELETE /books sauf pour ADMIN
 */