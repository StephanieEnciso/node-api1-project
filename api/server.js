const express = require('express')

const User = require('./users/model')

const server = express()

server.use(express.json())

server.get('/api/users', (req, res) => {
    User.find()
      .then(users => {
          res.status(200).json(users)
      })
      .catch(err => {
          res.status(500).json({
            message: "The users information could not be retrieved" 
          })
      })
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    User.findById(id)
      .then(user => {
          if(!user) {
              res.status(404).json({
                message: "The user with the specified ID does not exist"
              })
          } else {
              res.status(200).json(user)
          }
      })
      .catch(err => {
          res.status(500).json({
            message: "The user information could not be retrieved"
          })
      })
})

server.post('/api/users', (req, res) => {
    if(!req.body.name || !req.body.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
        User.insert(req.body)
          .then(user => {
              res.status(201).json(user)
          })
          .catch(err => {
              res.status(500).json({
                message: "There was an error while saving the user to the database"
              })
          })
    }
})

server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body

    try {
        if (!changes.name || !changes.bio) {
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        } else {
            const updatedUser = await User.update(id, changes)
            if (!updatedUser) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            } else {
                const user = await User.findById(id)
                res.status(200).json(user)
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "The user information could not be modified"
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await User.remove(id)
        if (!deleted) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            res.status(200).json(deleted)
        }
    } catch (err) {
        res.status(500).json({
            message: "The user could not be removed"
        })
    }
})

module.exports = server; 
