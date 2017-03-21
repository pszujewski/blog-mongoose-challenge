const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Schema
const blogSchema = new Schema({
   // _id: { type: Schema.ObjectId, auto: true },
    title: {type: String, unique: true, required: true},
    author: {
        firstName: {type: String, unique: true, required: true},
        lastName: {type: String, unique: true, required: true}
    },
    content: {type: String, required: true}
});

// Define virtual properties and methods
blogSchema.virtual('fullName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.fullName,
        created: Date.now()
    };
}
// Create our model
const blogPosts = mongoose.model('posts', blogSchema);

// export our model
module.exports = {blogPosts};