module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("success", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}