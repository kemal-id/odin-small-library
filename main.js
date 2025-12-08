function Book(metadata) {
  (this.title = metadata.title),
    (this.author = metadata.author),
    (this.pages = metadata.pages),
    (this.read = parseInt(metadata["read-status"]) == 1 ? true : false),
    (this.uid = metadata.uid);
}

Book.prototype.info = function () {
  console.log(
    `${this.title} by ${this.author} has ${this.pages} and ${
      this.read == true ? "has already read" : "not yet read"
    }`
  );
};

const books = [];
const bookContainer = document.querySelector(".book-container");
const bookForm = document.querySelector(".book-form");
bookForm.addEventListener("submit", formSubmitHandler);

function makeBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("book-card");
  bookCard.setAttribute("data-uid", book.uid);
  bookCard.innerHTML = `
          <img class="book-img" src="" alt="${book.title} cover">
          <div class="book-details">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-pages">${book.pages? book.pages + " pages" : ""}</p>
          </div>
        <button class="book-read-status ${
          book.read == 1 ? "have-read" : "not-read"
        }">${book.read == 1 ? "Have Read" : "Not Read"}</button>
        <button class="book-delete">Delete</button>`;
  return bookCard;
}

function checkListedBooks (uid) {
  const bookList = [...books];
  console.log(bookList);
  console.log(uid);
  let listed = false;

  for(let i = 0; i < bookList.length; i++) {
    if(bookList[i].uid == uid) {
      listed = true;
      break;
    }
  }

  return listed;
}

function addBooktoDisplay (book) {
  const bookElement = makeBookCard(book);
  bookContainer.appendChild(bookElement);
}

function formSubmitHandler(e) {
  e.preventDefault();

  let metadata = {};
  let data = new FormData(bookForm);
  for (const entry of data) {
    metadata[`${entry[0]}`] = entry[1].trim();
  }
  metadata.uid = crypto.randomUUID();

  const book = new Book(metadata);
  books.push(book);

  addBooktoDisplay(book);
}
