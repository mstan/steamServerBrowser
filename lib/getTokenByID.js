module.exports = function (req, res, next, id) {
    req.db.get('SELECT * FROM servers WHERE id = ?', [ id ], function (err, row) {
        // Note that 'row' will return as 'undefined' if the user does not
        // exist. Only continue on if the user does exist.
        if (row) {
            // hand the 'row' aka the 'server' to 'req' so we can use it later
            // down the line.
            req.server = row;

            // pass off control to the next route and return
            return next();
        }

        // fall through here if the user does not exist
        res.status(404).send('User not found.');
    });
};