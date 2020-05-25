// Cargamos el modelo recien creado
const User = require('../models/User.model.js');
// Cargamos el módulo de bcrypt
const bcrypt = require('bcrypt');
// Cargamos el módulo de jsonwebtoken
const jwt = require('jsonwebtoken');
///////////////////////////////////////////////////////////////////////////////////////////////
// Create and save a new User
exports.create = (req, res) => {
    // Validate if the request's body is empty
    // (does not include required data)
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "User data can not be empty"
        });
    }
    // Create a new User with request's data
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    // Save the User in the database
    user.save()
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
// Realiza la autenticacion de usuarios
exports.authenticate = (req, res) => {
    User.findOne({
        email: req.body.email
    }, function (err, userInfo) {
        if (err) {
            next(err);
        } else {
            if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                const token = jwt.sign({
                    id: userInfo._id
                }, req.app.get('secretKey'), {
                    expiresIn: '1h'
                });
                res.json({
                    status: "Ok",
                    message: "El usuario ha sido autenticado!!!",
                    data: {
                        user: userInfo,
                        token: token
                    }
                });
            } else {
                res.json({
                    status: "error",
                    message: "Invalid email/password!!",
                    data: null
                });
            }
        }
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
// Retrieve and list all Users
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.status(200).send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something wrong occurred while retrieving therecords."
            });
        });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
// Get a single User by its id
exports.findOne = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id:" + req.params.id
                });
            }
            res.status(200).send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id:" + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something wrong ocurred while retrieving the record with id:" + req.params.id
            });
        });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
// Update a User by its id
exports.update = (req, res) => {
    // Validate if the request's body is empty
    // (does not include required data)
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "User data can not be empty"
        });
    }
    // Find the User and update it with the request body data
    User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, {
            new: true
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id:" + req.params.id
                });
            }
            res.status(200).send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id:" + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something wrong ocurred while updating the record with id:" + req.params.id
            });
        });
};
//////////////////////////////////////////////////////////////////////////////////////////////////
// Delete a Product by its id
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id:" + req.params.id
                });
            }
            res.status(200).send({
                message: "User deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id:" + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something wrong ocurred while deleting the record with id:" + req.params.id
            });
        });
};