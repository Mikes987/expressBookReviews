const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> {
    for(const user of users) {
        if(user.user === username) {
            return true;
        }
    };
    return false;
}

const authenticatedUser = (username,password)=>{
    for(const user of users) {
        if(user.user === username && user.pwd === password) {
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password) {
    if(authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message: "User logged in"});
    }
    return res.status(400).json({message: "No such user " + username});
  } else {
    return res.status(404).json({message: "Please provide username and password to login"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    
    if(isbn && review && username) {
        reviewedBook = books[isbn];
        if(reviewedBook) {
            let reviewMessage = "";
            allReviews = reviewedBook.reviews;
            userReview = allReviews[username];
            if(userReview) {
                reviewMessage = "Review successfully modified";
            } else {
                reviewMessage = "Review successfully added";
            }
            allReviews[username] = review;
            return res.status(200).json({message: reviewMessage});
        }
        return res.status(200).json({message: "Book doesn't exist"});
    }
    return res.status(400).json({message: "Not enough information provided"});
});

// Remove review by user.
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Assuming session contains the username
    
    if (books) {
        particularBook = books[isbn];
        if(particularBook) {
            delete particularBook.reviews[username];
            return res.status(200).json({message: "Review successfully removed."});
        }
        return res.status(200).json({message: "Book not found."});
    }
    return res.status(404).json({ message: "Error in retrieving books." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
