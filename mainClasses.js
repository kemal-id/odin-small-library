class Book {
  constructor(metadata) {
    title = metadata.title;
    author = metadata.author;
    pages = metadata.pages;
    read = parseInt(metadata["read-status"]) == 1 ? true : false;
    uid = crypto.randomUUID();
  }
}

class DomHandler {}

class PubSub {
  events = {};

  subs = (event, callback) => {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  };

  unsubs = (event, callback) => {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((fn) => fn != callback);
  };

  publish = (event, data) => {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  };

  getEvents = () => {
    return this.events;
  }
}

//top-level function
(function () {
  const books = [
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
})();
