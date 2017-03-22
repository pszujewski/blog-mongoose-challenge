const express = require('express');
const bodyParser = require('body-parser');
const {blogPosts} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json(); 

router.get('/', (req, res) => {
  blogPosts.find().limit(10).exec()
  .then(posts => {
    res.json({
      blogPosts: posts.map((post)=> {
        return post.apiRepr();
      })
    });
  }).catch(err => {
    console.error(err);
  });
});

router.get('/:id', (req, res) => {
  blogPosts.findById(req.params.id).exec()
  .then((post) => {
    res.json(post);
  });
});

router.post('/', jsonParser, (req, res) => {
  const fields = ["title", "author", "content"];
  for (let i=0; i<fields.length; i++) {
    if(!req.body.hasOwnProperty(fields[i])) {
      let message = `Missing ${fields[i]}`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  let newPost = blogPosts.create({
    title: req.body.title, 
    author: req.body.author,
    content: req.body.content
  }).then((post) => {
    res.status(201).json(post.apiRepr())
  })
});

router.delete('/:id', (req, res) => {
  blogPosts.findByIdAndRemove(req.params.id)
  .exec()
  .then(result => {
    console.log(`Item Id ${req.params.id} has been removed`);
    res.status(204).end();
  }).catch(err => {
    let message = `The error is ${err.stack} does not exist`;
    res.status(400).send(message);
  });
});

router.put('/:id', jsonParser, (req, res) => {
  const id = { _id: req.params.id };
  const updateFields = {};
  const fields = ["title", "author", "content"];
  if (req.body.id !== req.params.id) {
    let message = `Request body ID of ${req.body.id} and request param id of ${req.params.id} do not match`;
    console.error(message);
    res.status(400).send(message);
  }
  fields.forEach(function(item) {
    if (item in req.body) {
      updateFields[item] = req.body[item];
    }
  });
  blogPosts.findOneAndUpdate(id, updateFields)
  .exec()
  .then(result => {
    res.status(201).json(result);
  }).catch(err => {
    let message = `Put ID ${req.params.id} does not exist`;
    console.error(err);
    res.status(400).send(message);
  });
 }); 

module.exports = {blogPostRouter: router};