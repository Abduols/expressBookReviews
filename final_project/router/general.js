/** @format */

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
	//Write your code here
	const { username, password } = req.body;

	if (!username && !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}
	if (!username) {
		return res.status(400).json({ message: "Username is required" });
	}
	if (!password) {
		return res.status(400).json({ message: "Password is required" });
	}

	const userExists = users.find((user) => user.username === username);
	if (userExists) {
		return res.status(409).json({ message: "Username already exists" });
	}

	users.push({ username, password });
	return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//Write your code here
	return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;

	return res.status(200).json(books[isbn]);
});

// Get book by ISBN using Promise callbacks
public_users.get("/isbn-promise/:isbn", function (req, res) {
	const isbn = req.params.isbn;

	const fetchBook = new Promise((resolve, reject) => {
		if (books[isbn]) {
			resolve(books[isbn]);
		} else {
			reject("Book not found");
		}
	});

	fetchBook
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(404).json({ message: err }));
});

// Get book by ISBN using async-await with Axios
public_users.get("/isbn-async/:isbn", async function (req, res) {
	const isbn = req.params.isbn;
	try {
		const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
		return res.status(200).json(response.data);
	} catch (err) {
		return res.status(404).json({ message: err.message });
	}
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	const author = req.params.author;
	const bookKeys = Object.keys(books);
	const matchingBooks = [];

	bookKeys.forEach((key) => {
		if (books[key].author === author) {
			matchingBooks.push(books[key]);
		}
	});
	return res.status(200).json(matchingBooks);
});

// Get book by Author using Promise callbacks
public_users.get("/author-promise/:author", function (req, res) {
	const author = req.params.author;

	const fetchByAuthor = new Promise((resolve, reject) => {
		const bookKeys = Object.keys(books);
		const matchingBooks = [];

		bookKeys.forEach((key) => {
			if (books[key].author === author) {
				matchingBooks.push(books[key]);
			}
		});

		if (matchingBooks.length > 0) {
			resolve(matchingBooks);
		} else {
			reject("No books found for this author");
		}
	});

	fetchByAuthor
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(404).json({ message: err }));
});

// Get book by Author using async-await with Axios
public_users.get("/author-async/:author", async function (req, res) {
	const author = req.params.author;
	try {
		const response = await axios.get(`http://localhost:5000/author/${author}`);
		return res.status(200).json(response.data);
	} catch (err) {
		return res.status(404).json({ message: err.message });
	}
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	const title = req.params.title;
	const bookKeys = Object.keys(books);
	const matchingBooks = [];

	bookKeys.forEach((key) => {
		if (books[key].title === title) {
			matchingBooks.push(books[key]);
		}
	});

	return res.status(200).json(matchingBooks);
});

// Get book by Title using Promise callbacks
public_users.get("/title-promise/:title", function (req, res) {
	const title = req.params.title;

	const fetchByTitle = new Promise((resolve, reject) => {
		const bookKeys = Object.keys(books);
		const matchingBooks = [];

		bookKeys.forEach((key) => {
			if (books[key].title === title) {
				matchingBooks.push(books[key]);
			}
		});

		if (matchingBooks.length > 0) {
			resolve(matchingBooks);
		} else {
			reject("No books found for this title");
		}
	});

	fetchByTitle
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(404).json({ message: err }));
});

// Get book by Title using async-await with Axios
public_users.get("/title-async/:title", async function (req, res) {
	const title = req.params.title;
	try {
		const response = await axios.get(`http://localhost:5000/title/${title}`);
		return res.status(200).json(response.data);
	} catch (err) {
		return res.status(404).json({ message: err.message });
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	return res.status(200).json(books[isbn].reviews);
});

// Get books using Promise callbacks
public_users.get("/books-promise", function (req, res) {
	const fetchBooks = new Promise((resolve, reject) => {
		if (books) {
			resolve(books);
		} else {
			reject("Unable to retrieve books");
		}
	});

	fetchBooks
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(500).json({ message: err }));
});

// Get books using async-await with Axios
public_users.get("/books-async", async function (req, res) {
	try {
		const response = await axios.get("http://localhost:5000/");
		return res.status(200).json(response.data);
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
});
module.exports.general = public_users;
