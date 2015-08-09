module.exports = function (req, res, next, id) {
    req.db.get('SELECT * FROM servers WHERE id = ?', [ id ], function (err, row) {
        // Note that 'row' will return as 'undefined' if the user does not
        // exist. Only continue on if the user does exist.
        if (row) {

            req.server = row;
            res.locals.server = row;

            return next();
        }
        res.status(404).send('Server not found.');
    });
};