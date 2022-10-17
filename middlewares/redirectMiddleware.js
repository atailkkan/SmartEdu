module.exports = (req, res, next) => {
    const user = req.session.userID;
    if(user) return res.status(301).redirect('/');
    next();
};