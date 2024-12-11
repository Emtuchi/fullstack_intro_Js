// Import the mongoose library, which provides a way to interact with MongoDB
const mongoose = require('mongoose');

// Destructure Schema and model from mongoose to define schemas and models
const {Schema, model} = mongoose;

// Define the schema for the Post model
const PostSchema = new Schema({
  // The title of the post, stored as a string
  title: String,

  // A brief summary of the post, stored as a string
  summary: String,

  // The main content of the post, stored as a string
  content: String,

  // The URL or path to the cover image of the post, stored as a string
  cover: String,

  // The author of the post, referenced by an ObjectId that points to a User model
  // This creates a relationship between the Post and User models
  author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  // Enable automatic timestamps for createdAt and updatedAt fields, it shows when a post was created and updated,
  // createdAt and updatedAt become parameters/variables like "_id" and can be used in Api points or used to display post info when parsed in front end, check ./Post.js file in frontend
  timestamps: true,
});

// Create a model named 'Post' using the defined schema
const PostModel = model('Post', PostSchema);

// Export the Post model to be used in other parts of the application
module.exports = PostModel;
