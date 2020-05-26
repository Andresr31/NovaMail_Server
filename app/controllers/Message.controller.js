// Cargamos el modelo recien creado
const Message = require('../models/Message.model.js');

///////////////////////////////////////////////////////////////////////////////////////////////
// Create and save a new Message
exports.createMessage = (req, res) => {
    // Validate if the request's body is empty
    // (does not include required data)
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "User data can not be empty"
        });
    }

    // Create a new Message with request's data
    const message = new Message({
        transmitter: req.body.transmitter,
        receiver: req.body.receiver,
        topic: req.body.topic,
        content: req.body.content,
        statusReceived: false,
        statusDeleted: false
    });
    // Save the Message in the database
    message.save()
        .then(data => {
            res.status(200).send({
                status: "succes",
                data: data
            });
        }).catch(err => {
            res.status(500).send({
                status: "error",
                message: err.message || "Something wrong occurred while creating therecord."
            });
        });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
// Retrieve and list all Messages on inbox
exports.findAll = (req, res) => {
    Message.find()
        .then(messages => {
            res.status(200).send(messages);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something wrong occurred while retrieving therecords."
            });
        });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
// Get a single Message by its id
exports.findOne = (req, res) => {
    Message.findById(req.params.id)
        .then(Message => {
            if (!Message) {
                return res.status(404).send({
                    message: "Message not found with id:" + req.params.id
                });
            }
            res.status(200).send(Message);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Message not found with id:" + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something wrong ocurred while retrieving the record with id:" + req.params.id
            });
        });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
// Delete a Message by its id
exports.delete = (req, res) => {
    Message.findByIdAndRemove(req.params.id)
        .then(message => {
            if (!message) {
                return res.status(404).send({
                    message: "message not found with id:" + req.params.id
                });
            }
            res.status(200).send({
                message: "message deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "message not found with id:" + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something wrong ocurred while deleting the record with id:" + req.params.id
            });
        });
};