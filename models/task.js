let mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: mongoose.Schema.Types.ObjectId,
    deadline: Date,
    isOpen: {
        type: Boolean,
        default: false
    }
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;