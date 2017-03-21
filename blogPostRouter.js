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
  for (let i=0; i<blogPosts.posts.length; i++) {
    let post = blogPosts.posts[i]; 
    if (req.params.id === post.id) {
      let message = `Post ID ${req.params.id} has been deleted`;
      blogPosts.posts.splice(i, 1);
      return res.status(200).send(message);
    }
  }
  let message = `Post ID ${req.params.id} does not exist`;
  res.status(400).send(message);
});

router.put('/:id', jsonParser, (req, res) => {
  blogPosts.findOneAndUpdate({
    _id: req.params.id
  },
    
  )
  for (let i=0; i<blogPosts.posts.length; i++) {
    let post = blogPosts.posts[i];
    if (req.params.id === post.id) {
      post.title = req.body.title;
      post.author = req.body.author;
      post.content = req.body.content;
      let message = `blog item ${post.title} updated`;
      return res.status(200).json(post);
    }
  }
  let message = `Put ID ${req.params.id} does not exist`;
  console.error(message);
  return res.status(400).send(message);
 }); 

module.exports = {blogPostRouter: router};