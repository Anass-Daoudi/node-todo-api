const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        //minlength: [1, 'min length is 1'],
        //match: [/^L/, 'Must begins with L'],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

/*
 TodoSchema.methods.displayTodo = function () {
 console.log(`Todo: ${this.text} ${this.completed} ${this.completedAt}`);
 };*/

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {Todo};