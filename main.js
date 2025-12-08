function Book(metadata) {
  this.title = metadata.title,
  this.author = metadata.author,
  this.pages = metadata.pages,
  this.read = parseInt(metadata["read-status"]) == 1? true: false,
  this.uid = metadata.uid;
}

Book.prototype.info = function () {
  console.log(`${this.title} by ${this.author} has ${this.pages} and ${this.read == true ? "has already read": "not yet read"}`);
};



const books = [];

const bookForm = document.querySelector(".book-form");
bookForm.addEventListener("submit", formSubmitHandler);

function formSubmitHandler(e) {
  e.preventDefault();
  console.log(e);
  let metadata = {};
  let data = new FormData(bookForm);
  for (const entry of data) {
    console.log(entry);
    metadata[`${entry[0]}`] = entry[1].trim();
  }
  metadata.uid = crypto.randomUUID();
  console.log(metadata);

  const book = new Book(metadata);
  books.push(book);
  console.log(books);
}
