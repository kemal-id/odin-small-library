function Book(metadata) {
  (this.title = metadata.title),
    (this.author = metadata.author),
    (this.pages = metadata.pages),
    (this.read = parseInt(metadata["read-status"]) == 1 ? true : false),
    (this.uid = crypto.randomUUID());
}

Book.prototype.getUID = function () {
  return this.uid;
};

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
];

const books = []

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

// function checkListedBooks(uid) {
//   const bookList = [...books];
//   console.log(bookList);
//   console.log(uid);
//   let listed = false;

//   for (let i = 0; i < bookList.length; i++) {
//     if (bookList[i].uid == uid) {
//       listed = true;
//       break;
//     }
//   }

//   return listed;
// }

templateBooks.forEach((dbook) => {
  const book = new Book(dbook);
  books.push(book);
  // console.log(book);
  updateAddDisplay();
});

function formSubmitHandler(e) {
  e.preventDefault();

  let metadata = {};
  let data = new FormData(bookForm);
  for (const entry of data) {
    metadata[`${entry[0]}`] = entry[1].trim();
  }

  addBookToArray(metadata);
  updateAddDisplay();
}

function readStatusChangeHandler(e) {
  e.preventDefault();
  let classList = e.target.classList;
  // console.log(e.target.classList);
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
  const arr = books.filter(book => book.uid != parentNodeUID);
  console.log(arr);
}

function getNodesUID() {
  const bookNodes = document.querySelectorAll(".book-card");
  const nodesUID = [];
  bookNodes.forEach((node) => {
    nodesUID.push(node.dataset.uid);
  });
  // console.log(nodesUID);
  return nodesUID;
}

function addBookToArray(data) {
  const book = new Book(data);
  books.push(book);
}

function updateAddDisplay() {
  const bookList = [...books];
  const displayedNodes = getNodesUID();
  // console.log(displayedNodes);
  bookList.forEach((book) => {
    if (!displayedNodes.includes(book.uid)) {
      const bookElement = makeBookCard(book);
      bookContainer.appendChild(bookElement);
    }
  });
}

function updateDelDisplay() {
  const bookList = [...books];
  const booksUID = [];
  bookList.forEach(book => booksUID.push(book.uid));
  const displayedNodes = getNodesUID();
  displayedNodes.forEach(node => {
    if(!booksUID.includes(node)) {
      const el = document.querySelector(`[data-uid]=${node}`);
      el.parentNode.removeChild(el);
    }
  })
}

// console.log(document.querySelectorAll(".book-card"));
