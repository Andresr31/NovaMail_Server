const rutasProtegidas = require("../../helpers/validation.auth")

module.exports = (app) => {
    const messages = require('../controllers/Message.controller.js');
    // Create a new Message
    app.post('/api/message', rutasProtegidas, messages.createMessage);
    // List all received Messages
    app.get('/api/inbox/:id', rutasProtegidas, messages.findAll);
    // Get a single recived Message by id
    app.get('/api/messages/:id', rutasProtegidas, messages.findOne);
    // Delete a received Message by id
    app.delete('/api/messages/:id', rutasProtegidas, messages.delete);
    // Change status Message received
    //app.delete('/api/messages/:id', rutasProtegidas, messages.changeStatus);
    // List all sent Messages
    app.get('/api/outbox/:id', rutasProtegidas, messages.findAll);
    // Get a single sent Message by id
    app.get('/api/messages/:id', rutasProtegidas, messages.findOne);
}