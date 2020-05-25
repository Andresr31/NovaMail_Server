module.exports = (app) => {
    const users = require('../controllers/User.controller.js');
    // Create a new User
    app.post('/register', users.create);
    // Authenticate a User
    app.post('/authenticate', users.authenticate);
    // List all Users
    app.get('/users', users.findAll);
    // Get a single User by id
    app.get('/users/:id', users.findOne);
    // Update a User by id
    app.put('/users/:id', users.update);
    // Delete a User by id
    app.delete('/users/:id', users.delete);
}