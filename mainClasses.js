class Book {
  constructor(metadata) {
    this.title = metadata.title;
    this.author = metadata.author;
    this.pages = metadata.pages;
    this.read = parseInt(metadata["read-status"]) == 1 ? true : false;
    this.uid = crypto.randomUUID();
  }
}

class PubSub {
  #events = {};

  subs = (event, callback) => {
    if (!this.#events[event]) this.#events[event] = [];
    this.#events[event].push(callback);
  };

  unsubs = (event, callback) => {
    if (!this.#events[event]) return;
    this.#events[event] = this.events[event].filter((fn) => fn != callback);
  };

  publish = (event, data) => {
    if (!this.#events[event]) {
      console.log("Haven't seen the event");
      return;
    }
    this.#events[event].forEach((callback) => callback(data));
  };
}

const ps = new PubSub();

//domHandler
(function () {
  const bookContainer = document.querySelector(".book-container");
  const bookForm = document.querySelector(".book-form");
  const newBookButton = document.querySelector(".form-toggle");

  newBookButton.addEventListener("click", formToggleHandler);
  bookForm.addEventListener("submit", formSubmitHandler);

  function formSubmitHandler(e) {
    e.preventDefault();

    let metadata = {};
    let data = new FormData(bookForm);
    for (const entry of data) {
      metadata[`${entry[0]}`] = entry[1].trim();
    }

    ps.publish("addBookToArray", metadata);
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

  function readStatusChangeHandler(e) {
    e.preventDefault();
    let classList = e.target.classList;
    let nodeUid = e.target.parentNode.dataset.uid;
    if (classList.contains("have-read")) {
      classList.replace("have-read", "not-read");
      e.target.innerText = "Not Read";
    } else {
      classList.replace("not-read", "have-read");
      e.target.innerText = "Have Read";
    }

    ps.publish("changedReadStatus", [nodeUid, e.target.innerText]);
  }

  function makeReadStatusButton(readStatus) {
    const readStatusButton = document.createElement("button");
    readStatusButton.classList.add("book-read-status");
    readStatusButton.classList.add(readStatus ? "have-read" : "not-read");
    readStatusButton.innerText = readStatus ? "Have Read" : "Not Read";
    readStatusButton.addEventListener("click", readStatusChangeHandler);

    return readStatusButton;
  }

  function delButtonHandler(e) {
    const parentNodeUID = e.target.parentNode.dataset.uid;
    ps.publish("delBookInArray", parentNodeUID);
  }

  function makeDeleteButton() {
    const delButton = document.createElement("button");
    delButton.classList.add("book-delete");
    delButton.innerText = "Delete";
    delButton.addEventListener("click", delButtonHandler);

    return delButton;
  }

  function getNodesUID() {
    const bookNodes = document.querySelectorAll(".book-card");
    const nodesUID = [];
    bookNodes.forEach((node) => {
      nodesUID.push(node.dataset.uid);
    });
    return nodesUID;
  }

  function formToggleHandler() {
    const formSection = document.querySelector(".form-section");
    if (formSection.classList.contains("is-hidden")) {
      formSection.classList.remove("is-hidden");
      newBookButton.innerText = "Hide Form";
    } else {
      formSection.classList.add("is-hidden");
      newBookButton.innerText = "Add New Book";
    }
  }

  function updateDisplay([books, action]) {
    const add = "add";
    const del = "del";
    const bookList = [...books];
    if (action === add) {
      const displayedNodes = getNodesUID();
      bookList.forEach((book) => {
        if (!displayedNodes.includes(book.uid)) {
          const bookElement = makeBookCard(book);
          bookContainer.appendChild(bookElement);
        }
      });
    } else if (action === del) {
      const booksUID = [];
      bookList.forEach((book) => booksUID.push(book.uid));
      let bookNodes = document.querySelectorAll(".book-card");

      for (let i = 0; i < bookNodes.length; i++) {
        let index = booksUID.indexOf(bookNodes[i].dataset.uid);
        if (index == -1) {
          bookNodes[i].remove();
          break;
        }
      }
    }
  }

  ps.subs("updateBookDisplay", updateDisplay);
})();

//main function
(function () {
  const books = [];

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

  templateBooks.forEach((tbook) => {
    addBookToArray(tbook);
  });

  function addBookToArray(data) {
    const book = new Book(data);
    books.push(book);
    ps.publish("updateBookDisplay", [books, "add"]);
  }

  function delBookInArray(bookUid) {
    for (let i = 0; i < books.length; i++) {
      if (books[i].uid == bookUid) {
        books.splice(i, 1);
        ps.publish("updateBookDisplay", [books, "del"]);
        break;
      }
    }
  }

  function changeReadStatus([id, status]) {
    books.forEach((book) => {
      if (book.uid == id) {
        let read = "Have Read";
        status == read ? (book.read = true) : (book.read = false);
      }
    });
  }

  ps.subs("addBookToArray", addBookToArray);
  ps.subs("delBookInArray", delBookInArray);
  ps.subs("changedReadStatus", changeReadStatus);
})();
