if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
    // we are in production - return the prod set of keys.
} else {
    module.exports = require('./dev');
    // we are in development - return the dev keys.
}