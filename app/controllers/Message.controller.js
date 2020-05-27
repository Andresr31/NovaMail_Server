// Cargamos el modelo recien creado
const Message = require('../models/Message.model.js');
const User = require('../models/User.model.js');
///////////////////////////////////////////////////////////////////////////////////////////////
// Create and save a new Message
exports.createMessage = async (req, res) => {
    // Validate if the request's body is empty
    // (does not include required data)
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "User data can not be empty"
        });
    }
    
    var receiver = [];
    for (let i = 0; i < req.body.receiver.split(",").length; i++) {
        const email = req.body.receiver.split(",")[i];
        let id = await searchUser(email);
        receiver.push(id);
    }
    
    //Create a new Message with request's data
    const message = new Message({
        transmitter: req.body.transmitter,
        receiver: receiver,
        topic: req.body.topic,
        content: req.body.content,
        statusReceived: false,
        statusDeleted:false,
    });
    console.log(message);
    // Save the Message in the database
    message.save()
        .then(data => {
            console.log(data);
            res.status(200).send({
                status: "succes",
                data: data
            });
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                status: "error",
                message: err.message || "Something wrong occurred while creating therecord."
            });
        });
};

/// Función asincrona que retorna una promesa (User) la cual se utilizará para almacenar su id en el mensaje
async function searchUser(email){
    let user = await User.findOne({email: email});
    return user._id;
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// Retrieve and list all Messages on inbox
exports.findAllInbox = (req, res) => {
    Message.find({receiver: req.params.id})
        .then(async messages => {
            let data = []
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                let user = await searchUserById(message.transmitter);
                data.push({message:message, transmitter:user});
            }
            // messages.forEach(async message => {
            //     let user = await searchUserById(message.transmitter);
            //     data.push({message:message, transmitter:user});
            //     //messages.transmitter = user
            //     console.log(data);
            // });
            return res.status(200).send(data);

        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Something wrong occurred while retrieving therecords."
            });
        });

};
async function searchUserById(id){
    let user = await User.findOne({_id:id});
    return user;
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// Retrieve and list all Messages on outbox
exports.findAllOutbox = (req, res) => {
    Message.find({transmitter: req.params.id})
    .then(async messages => {
        let data = []
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            let users = []
            for (let j = 0; j < message.receiver.length; j++) {
                const uId = message.receiver[j];
                let user = await searchUserById(uId);
                users.push(user);
            }
            
            data.push({message:message, receivers:users});
            
        }
        // messages.forEach(async message => {
        //     let user = await searchUserById(message.transmitter);
        //     data.push({message:message, transmitter:user});
        //     //messages.transmitter = user
        //     console.log(data);
        // });
        return res.status(200).send(data);

    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Something wrong occurred while retrieving therecords."
        });
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// Get a single Message by its id on Inbox
exports.findOneInbox = (req, res) => {
    Message.findById(req.params.id)
        .then(async message => {
            if (!message) {
                return res.status(404).send({
                    message: "Message not found with id:" + req.params.id
                });
            }
            
            let data = [];
            message.statusReceived = true;
            Message.findByIdAndUpdate(req.params.id, {
                transmitter: message.transmitter,
                receiver: message.receiver,
                topic: message.topic,
                content: message.content,
                statusReceived: message.statusReceived,
                statusDeleted:false,
            }, {
                new: true
            });

            let user = await searchUserById(message.transmitter);
            data.push({message:message, transmitter:user});
            // messages.forEach(async message => {
            //     let user = await searchUserById(message.transmitter);
            //     data.push({message:message, transmitter:user});
            //     //messages.transmitter = user
            //     console.log(data);
            // });
            return res.status(200).send(data);


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
//////////////////////////////////////////////////////////////////////////////////////////////////
// Get a single Message by its id on Outbox
exports.findOneOutbox = (req, res) => {
    Message.findById(req.params.id)
        .then(async Message => {
            if (!Message) {
                return res.status(404).send({
                    message: "Message not found with id:" + req.params.id
                });
            }

            let data = [];
                
            let users = []
            for (let j = 0; j < Message.receiver.length; j++) {
                const uId = Message.receiver[j];
                let user = await searchUserById(uId);
                users.push(user);
            }
                
            data.push({message:Message, receivers:users});
                
            // messages.forEach(async message => {
            //     let user = await searchUserById(message.transmitter);
            //     data.push({message:message, transmitter:user});
            //     //messages.transmitter = user
            //     console.log(data);
            // });
            return res.status(200).send(data);


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

exports.changeStatusDeleted = (req, res) => {
    Message.findById(req.params.id)
        .then(async message => {
            if (!message) {
                return res.status(404).send({
                    message: "Message not found with id:" + req.params.id
                });
            }
            
            let data = [];
            message.statusDeleted = req.body.statusDeleted;
            Message.findByIdAndUpdate(req.params.id, {
                transmitter: message.transmitter,
                receiver: message.receiver,
                topic: message.topic,
                content: message.content,
                statusReceived: message.statusReceived,
                statusDeleted: message.statusDeleted,
            }, {
                new: true
            })
            .then(message => {
                if (!message) {
                    return res.status(404).send({
                        message: "Message not found with id:" + req.params.id
                    });
                }
                res.status(200).send(message);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Message not found with id:" + req.params.id
                    });
                }
                return res.status(500).send({
                    message: "Something wrong ocurred while updating the record with id:" + req.params.id
                });
            });
        });
};