const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required:true
    }
})

module.exports = mongoose.model('BirthdayList',birthdaySchema, `birthday-list`);