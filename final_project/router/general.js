const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"user": username, "pwd": password});
            return res.status(200).json({ message: "User " + username + " successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User " + username + " already exists!" });
        }
    }
    return res.status(404).json({ message: "Username or password not provided" });
});

// Task 10: Code for getting list of books in shop using promise callback
function retrieveBooks() {
    return new Promise((resolve, reject) => {
        if(books) {
            resolve(books);
        } else [
            reject(new Error("Booklist doesn't exist"))
        ]
    });
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  retrieveBooks().then((booksInList) => res.status(200).send(JSON.stringify(booksInList, null, 4)),
                        (err) => res.status(404).send(err.message));
  /*
  if(books) {
    return res.status(200).send(JSON.stringify(booksInList, null, 4));
  } else {
    return res.status(404).send({message: "An error occured during loading books"});
  }*/
});

// Task 11: Code for getting book details based on ISBN using Promise callback
function retrieveBookFromISBN(isbn) {
    const book = books[isbn];
    return new Promise((resolve, reject) => {
      if (book) {
        resolve(book);
      } else {
        reject(new Error("The provided book does not exist"));
      }
    });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    retrieveBookFromISBN(isbn).then((filteredBook) => res.status(200).send(JSON.stringify(filteredBook, null, 4)),
                                    (err) => res.status(400).send({message: "Book not found"}));
    
    /*
    if(books) {
        const filteredBook = books[isbn];
        if(filteredBook) {
            return res.status(200).send(JSON.stringify(filtered, null, 4));
        }
        return res.status(400).send({message: "Book doesn't exist"});   
    } else {
        return res.status(404).send({message: "An error occured during loading books"});
    }
    */
});
  

// Task 12: Code for getting book details based on Author using Promise callback
function retrieveBookFromAuthor(author) {
    let authorsBooks = [];
    return new Promise((resolve, reject) => {
        for(const [isbn, book] of Object.entries(books)) {
            if(book.author === author) {
                authorsBooks.push(book);
            }
        }
        if(authorsBooks.length > 0) {
            resolve(authorsBooks)
        } else {
            reject(new Error("Author does not exist"));
        }
    })
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    retrieveBookFromAuthor(author).then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)),
                                        (err) => res.status(400).send({message: err}));

    /*if(books) {
        let authorsBooks = [];
        const author = req.params.author;
        
        for(const [isbn, book] of Object.entries(books)) {
            if(book.author === author) {
                authorsBooks.push(book)
            }
        }
        return res.status(200).send(JSON.stringify(authorsBooks, null, 4));
    }
    return res.status(404).send({message: "An error occured during loading books"});
    */
});

// Task 13: Code for getting  book details based on Title using Promise callback
function retrieveBookFromTitle(title) {
    let bookTitles = [];
    return new Promise((resolve, reject) => {
        for(const [isbn, book] of Object.entries(books)) {
            if(book.title === title) {
                bookTitles.push(book);
            }
        }
        if(bookTitles.length > 0) {
            resolve(bookTitles)
        } else {
            reject(new Error("Book title does not exist"));
        }
    })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    retrieveBookFromTitle(title).then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)),
                                        (err) => res.status(400).send({message: "No books found"}));
    /*
    if(books) {
        let authorsBooks = [];
        const title = req.params.title;
        for(const [isbn, book] of Object.entries(books)) {
            if(book.title === title) {
                authorsBooks.push(book)
            }
        }
        return res.status(200).send(JSON.stringify(authorsBooks, null, 4));
    }
    return res.status(404).send({message: "An error occured during loading books"});
    */
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    if(books) {
        isbn = req.params.isbn;
        const reviews = books[isbn].reviews
        return res.status(200).send(JSON.stringify(reviews, null, 4));
    } else {
        return res.status(404).send({message: "An error occured during loading books"});
    }
});

module.exports.general = public_users;
