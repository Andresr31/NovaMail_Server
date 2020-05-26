const rutasProtegidas = require("../../helpers/validation.auth")

module.exports = (app) => {
    const users = require('../controllers/User.controller.js');
    // Create a new User
    app.post('/api/register', users.create);
    // Authenticate a User
    app.post('/api/authenticate', users.authenticate);
    // List all Users
    app.get('/api/users',rutasProtegidas, users.findAll);
    // Get a single User by id
    app.get('/api/users/:id',rutasProtegidas, users.findOne);
    // Update a User by id
    app.put('/api/users/:id',rutasProtegidas, users.update);
    // Delete a User by id
    app.delete('/api/users/:id',rutasProtegidas, users.delete);
}