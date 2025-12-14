const ADD = "ADD";
const DEL = "DEL";

const templateBooks = [
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    pages: 829,
    "read-status": 1,
  },
  {
    title: "The Upside of Stress",
    author: "Kelly McGonigal",
    pages: 288,
    "read-status": 1,
  },
  {
    title: "Ada Apa Dengan Cinta?",
    author: "Silvarani",
    pages: 532,
    "read-status": 0,
  },
  {
    title: "Harry Potter",
    author: "Forgot",
    pages: 8756,
    "read-status": 0,
  },
];

function Book(metadata) {
  (this.title = metadata.title),
    (this.author = metadata.author),
    (this.pages = metadata.pages),
    (this.read = parseInt(metadata["read-status"]) == 1 ? true : false),
    (this.uid = crypto.randomUUID());
}

// const books = [];

const bookContainer = document.querySelector(".book-container");
const bookForm = document.querySelector(".book-form");

templateBooks.forEach((dbook) => {
  const book = new Book(dbook);
  books.push(book);
  updateDisplay(ADD);
});

bookForm.addEventListener("submit", formSubmitHandler);

function formSubmitHandler(e) {
  e.preventDefault();

  let metadata = {};
  let data = new FormData(bookForm);
  for (const entry of data) {
    metadata[`${entry[0]}`] = entry[1].trim();
  }

  addBookToArray(metadata);
  updateDisplay(ADD);
}

function updateDisplay(action) {
  const bookList = [...books];
  if (action === ADD) {
    const displayedNodes = getNodesUID();
    bookList.forEach((book) => {
      if (!displayedNodes.includes(book.uid)) {
        const bookElement = makeBookCard(book);
        bookContainer.appendChild(bookElement);
      }
    });
  } else if (action === DEL) {
    const booksUID = [];
    bookList.forEach((book) => booksUID.push(book.uid));
    let bookNodes = document.querySelectorAll(".book-card");
    console.log(bookNodes);

    for (let i = 0; i < bookNodes.length; i++) {
      let index = booksUID.indexOf(bookNodes[i].dataset.uid);
      console.log(index);
      if (index == -1) {
        bookNodes[i].remove();
        break;
      }
    }
  }
}

function makeBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("book-card");
  bookCard.setAttribute("data-uid", book.uid);
  bookCard.innerHTML = `
          <img class="book-img" src="" alt="${book.title} cover">
          <div class="book-details">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-pages">${book.pages ? book.pages + " pages" : ""}</p>
          </div>`;
  bookCard.appendChild(makeReadStatusButton(book.read));
  bookCard.appendChild(makeDeleteButton());

  return bookCard;
}

function makeReadStatusButton(readStatus) {
  const readStatusButton = document.createElement("button");
  readStatusButton.classList.add("book-read-status");
  readStatusButton.classList.add(readStatus ? "have-read" : "not-read");
  readStatusButton.innerText = readStatus ? "Have Read" : "Not Read";
  readStatusButton.addEventListener("click", readStatusChangeHandler);

  return readStatusButton;
}

function makeDeleteButton() {
  const delButton = document.createElement("button");
  delButton.classList.add("book-delete");
  delButton.innerText = "Delete";
  delButton.addEventListener("click", delButtonHandler);

  return delButton;
}



function readStatusChangeHandler(e) {
  e.preventDefault();
  let classList = e.target.classList;
  if (classList.contains("have-read")) {
    classList.replace("have-read", "not-read");
    e.target.innerText = "Not Read";
  } else {
    classList.replace("not-read", "have-read");
    e.target.innerText = "Have Read";
  }
}

function delButtonHandler(e) {
  const parentNodeUID = e.target.parentNode.dataset.uid;
  console.log(e.target.parentNode.dataset.uid);
  console.log(books);
  let index = NaN;
  for (let i = 0; i < books.length; i++) {
    if (books[i].uid == parentNodeUID) {
      console.log(i);
      books.splice(i, 1);
      index = i;
      break;
    }
  }
  console.log(books);
  updateDisplay(DEL);
}

function getNodesUID() {
  const bookNodes = document.querySelectorAll(".book-card");
  const nodesUID = [];
  bookNodes.forEach((node) => {
    nodesUID.push(node.dataset.uid);
  });
  return nodesUID;
}

function addBookToArray(data) {
  const book = new Book(data);
  books.push(book);
}

const newBookButton = document.querySelector(".form-toggle");
newBookButton.addEventListener("click", formToggleHandler);

function formToggleHandler(e) {
  const formSection = document.querySelector(".form-section");
  if (formSection.classList.contains("is-hidden")) {
    formSection.classList.remove("is-hidden");
  } else {
    formSection.classList.add("is-hidden");
  }
}
