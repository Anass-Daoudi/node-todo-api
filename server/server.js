//third party libraries
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

//built in import
const path = require('path');

//local import
const {mongoose} = require(path.join(__dirname, 'db/mongoose'));
const {Todo} = require(path.join(__dirname, 'models/todo'));

const port = process.env.PORT || 3000;

const app = express();
const db = mongoose.connection;

//middleware returned
const jsonParser = bodyParser.json();

db.on('error', () => {
    console.log('Unable to connect to MongoDB server!');
});

db.on('open', () => {
    console.log('Connected to MongoDB server database');
});

app.post('/todos', jsonParser, (req, res) => {
    var todo = new Todo({
        text: req.body.text
    }).save().then((todo) => {
        res.json({todo});
    }, (error) => {
        console.log(error);
        res.status(400).json();
    });
});

app.get('/todos', (req, res) => {
    Todo.find({}, {}, {}).then((todos) => {
        res.json({todos});
    }, (error) => {
        res.status(400).json(/*error*/);
    });
});


app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).json();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).json();
        }
        res.json({todo});
    }).catch((error) => {
        res.status(400).json();
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).json();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).json();
        }
        res.json({todo});
    }).catch((error) => {
        res.status(400).json();
    });
});

app.patch('/todos/:id', jsonParser, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).json();
    }

    let selectedProperties = [];
    if (typeof req.body.text == 'string' && req.body.text.length > 0) {
        selectedProperties.push('text');
    }
    if (_.isBoolean(req.body.completed)) {
        selectedProperties.push('completed');
    }
    let body = _.pick(req.body, selectedProperties);

    if (body.completed == true) {
        //milliseconds
        body.completedAt = new Date().getTime();
    } else if (body.completed == false) {
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {
            new: true/*,         runValidators: true*/
        }
    ).then((updatedTodo) => {
        if (!updatedTodo) {
            return res.status(404).json();
        }
        res.json(updatedTodo);
    }).catch((error) => {
        res.status(400).json();
    });
});


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});