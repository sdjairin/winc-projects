import bookData from "../../data/books.json" with { type: "json" };
import notFoundError from "../../errors/NotFoundError.js";

const updateBookById = (id, title, author, isbn, pages, available, genre) => {
  const book = bookData.books.find((book) => book.id === id);

  if (!book) {
    throw new notFoundError("Book", id);
  }

  book.title = title ?? book.title;
  book.author = author ?? book.author;
  book.isbn = isbn ?? book.isbn;
  book.pages = pages ?? book.pages;
  book.available = available ?? book.available;
  book.genre = genre ?? book.genre;

  return book;
};

export default updateBookById;
