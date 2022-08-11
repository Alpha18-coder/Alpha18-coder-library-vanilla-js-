// Data Structures

class Book {
    constructor(
        title = 'Unknown',
        author = 'Unknown',
        pages = '0',
        isRead = false
    ) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

class Library {
  constructor() {
    this.books = []
  }

  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook)
    }
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title)
  }

  getBook(title) {
    return this.books.find((book) => book.title === title)
  }

  isInLibrary(newBook) {
    return this.books.some((book) => book.title === newBook.title)
  }
}

let library = new Library();

// User interface
const $ = id => document.getElementById(id);

const $gridContainer = $('container');
const $addBookBtn = $('addBtn');
const $submitBtn = $('submit');
const $overlay = $('overlay');
const $bookForm = $('bookForm');
const $errorMsg = $('errorMsg');
const $addBookModal = $('addBookModal');

$addBookBtn.addEventListener('click', () => {
    $bookForm.reset();
    $addBookModal.classList.add('active');
    $overlay.classList.add('active');
});


function closeAddBookModal()  {
    $addBookModal.classList.remove('active');
    $overlay.classList.remove('active');
    $errorMsg.classList.remove('active');
}

$overlay.onclick = closeAddBookModal;



const updateBooksGrid = () => {
  resetBooksGrid()
  for (let book of library.books) {
    createBookCard(book)
  }
}

const resetBooksGrid = () => {
  $gridContainer.innerHTML = ''
}

function createBookCard(book) {

  const $create = (element) => document.createElement(element);

  const bookCard = $create('div');
  const title = $create('span');
  const author = $create('p');
  const pages = $create('p');
  const buttonGroup = $create('div');
  const readBtn = $create('button');
  const removeBtn = $create('button');

  bookCard.classList.add('book-card');
  buttonGroup.classList.add('button-group');
  readBtn.classList.add('btn');
  removeBtn.classList.add('btn');
  removeBtn.classList.add('btn-light-gray');
  readBtn.onclick = toggleRead;
  removeBtn.onclick = removeBook;

  title.textContent = `"${book.title}"`;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  removeBtn.textContent = 'Remove';

  if (book.isRead) {
    readBtn.textContent = 'Read';
    readBtn.classList.add('btn-light-green');
  } else {
    readBtn.textContent = 'Not read';
  }

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  buttonGroup.appendChild(readBtn);
  buttonGroup.appendChild(removeBtn);
  bookCard.appendChild(buttonGroup);
  $gridContainer.appendChild(bookCard);
}

const getBookFromInput = () => {
    const title = $('title').value;
    const author = $('author').value;
    const pages = $('pages').value;
    const isRead = $('isRead').checked;
    return new Book(title, author, pages, isRead);
}


$bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newBook = getBookFromInput();

    if(library.isInLibrary(newBook)) {
        $errorMsg.innerText = 'This book already exists in your library';
        $errorMsg.classList.add('active');
        return;
    } else {
        library.addBook(newBook);
        saveLocal();
        updateBooksGrid();
    }

    closeAddBookModal();
})

const removeBook = (e) => {
  const title = e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll(
    '"',
    ''
  )
  library.removeBook(title)
  saveLocal()
  updateBooksGrid()
}

const toggleRead = (e) => {
  const title = e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll(
    '"',
    ''
  )
  const book = library.getBook(title)

  book.isRead = !book.isRead
  saveLocal()
  updateBooksGrid()
}

// utils 

const JSONToBook = (book) => {
  return new Book(book.title, book.author, book.pages, book.isRead)
}

// local storage

const saveLocal = () => {
  localStorage.setItem('library', JSON.stringify(library.books))
}

const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem('library'))
  if (books) {
    library.books = books.map((book) => JSONToBook(book))
  } else {
    library.books = []
  }
}

restoreLocal();
updateBooksGrid();

