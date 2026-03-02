// un middleware "timer" qui ajoute a la requete un attribut nommé "requestTime" qui contient l'heure de la requete

export function timer(req, res, next) {
    req.requestTime = new Date().toISOString();
    next();
}