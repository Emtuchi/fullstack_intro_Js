const express = require("express");
const cors = require('cors');
const { default: mongoose } = require("mongoose");
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); //this is used so that we can upload files in /post
const fs = require('fs');
const Post = require("./models/Post");
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'as7y3gydg876gfr';

const PORT = process.env.PORT || 3001;

//we need to set credentials and origin because we included credentials in the fetch request of our login page, so that our jwt token can be saved in our react app and used in subsequent requests after login
// or else we get a cors error
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://Jurge:2xyWmMl4pjvFqzV8@cluster0.p11jq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post("/register", async (req, res) => {
    const {username, password} = req.body; //get data from the form in register page, and {} is used to get variable from our server
    try {
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt),
        }); //create a user(store data from the form in a db using mongoose) using our user model that we created and export from ./models/User.js
        res.json(userDoc); //send the data to our website as json, so we can see it using web dev tool in browser
    } catch(e) {
        res.status(400).json(e);
    }
    
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    if (userDoc) {
        const passok = bcrypt.compareSync(password, userDoc.password);
        if (passok) {
            //id is gotten from userDoc using that syntax, ":" is like "="
            //jwt.sign is used to create a token with encryted info(name, id) of the user, it could be any info and is encryted using a salt(called "secret" for us)
            jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({ //send token as a json, it'll look like this, token: ....., the token in ''(the string) will be the json parameter
                    id: userDoc._id,
                    username, // After setting the cookie, the server sends a JSON response to the client, just for confirmation
                }); 
            });
        } else {
            res.status(400).json('wrong credentials');
        }
    } else {
        res.status(400).json('user not found');
    }
});

app.get('/profile', (req, res) => {
    // get the token from our app
    const {token} = req.cookies //"cookies" is a parameter in our app just like "body" or "Header" that stores our token, use google inspect to see and "token" is a name we gave our jwt token in /login
    //jwt.verify verifies our retrieved token by cross referencing it with "secret"(a string variable we used to create the token in the backend)
    jwt.verify(token, secret, {}, (err, Userinfo) => {
        if(err) throw err;
        res.json(Userinfo);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok')//set token to be an empty string to clear it, unlike in /login
});

app.post('/post', upload.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    
    // Rename the uploaded file to include its extension
    fs.renameSync(path, newPath);
  
    const { token } = req.cookies;
    
    // Verify the JWT token and create a new post
    jwt.verify(token, secret, {}, async (err, UserInfo) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: UserInfo.id, // we created "id" when we were creating cookies(our token) in /login from the auto generated "_id" in our db
      });
      // Respond with the created post document
      res.json(postDoc);
    });
});

// Route to get a list of posts
app.get('/post', async (req, res) => {
    // Find all posts, populate author information, sort by creation date, and limit to 20 results
    res.json(
      await Post.find() // find posts stored in our db, 'Post' is the Post model we created and exported from ./models/Post.js and it can be used for this
        .populate('author', ['username']) // When you use .populate, Mongoose fetches the full details of the author from our "User model" collection and replaces the ID with the actual user data in the result., and we want only username
        .sort({ createdAt: -1 }) // sort by when it was created 
        .limit(20) // limit it to just 20 posts, when it is displayed on the app
    );
});

// Route to get a single post by ID, check ./Pages/PostPage from our "server" folder for more info
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    // Find a post by its ID and populate author information
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

// Route to handle updating an existing post
app.put('/post', upload.single('file'), async (req, res) => {
    let newPath = null;
    
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      
      // Rename the uploaded file to include its extension
      fs.renameSync(path, newPath);
    }
  
    const { token } = req.cookies;
    
    // Verify the JWT token and update the post
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      
      if (!isAuthor) {
        // Respond with error status if the user is not the author of the post
        return res.status(400).json('you are not the author');
      }
      
      // Update the post document
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      if (newPath) postDoc.cover = newPath;

      // Save the updated document
      await postDoc.save();
  
      // Respond with the updated post document
      res.json(postDoc);
    });
});
  

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`)
});