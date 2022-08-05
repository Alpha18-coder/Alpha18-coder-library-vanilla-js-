/* Data Structures */ 

class Book {
  constructor(
    title='unknow',
    author='unknow',
    pages=0,
    isRead=false
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(newBook) {
    if(!this.isInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }

  getBook(title) {
    return this.books.find(book => book.title === title);
  }

  removeBook(title) {
    this.books = this.books.filter(book => book.title !== title);
  }

  isInLibrary(newBook) {
    return this.books.some(book => book.title === newBook.title);
  }
}

const library = new Library();

/* User Interface */
const container = document.getElementById('container');
const addBookBtn = document.getElementById('addBtn');
const submit = document.getElementById('submit');
const overlay = document.getElementById('overlay');
const bookForm = document.getElementById('bookForm');
const errorMsg = document.getElementById('errorMsg');


function openAddBookModal() {
    addBookModal.classList.add('active');
    overlay.classList.add('active');
}

function closeAddBookModal() {
    addBookModal.classList.remove('active');
    overlay.classList.remove('active');
    errorMsg.classList.remove('active');
}

const updateBooksGrid = () => {
  for(let book of library.books) {
    createBookCard(book);
  }
}

const createBookCard = (book) => {
  const readBtn = document.createElement('button');
  const removeBtn = document.createElement('button');

  readBtn.classList.add('btn')
  removeBtn.classList.add('btn');
  removeBtn.classList.add('remove-btn');
  removeBtn.textContent = 'remove';
  removeBtn.onclick = deleteBook;
  readBtn.onclick = toggleRead;

  container.innerHTML = `
    <div class='book-card'>
      <h1>"${book.title}"</h1>
      <p>${book.author}</p>
      <p>${book.pages}</p>
      <div class='btn-container'>
      </div>
    </div>
  `

  if (book.isRead) {
    readBtn.textContent = 'read';
    readBtn.classList.add('light-green');
  } else {
    readBtn.textContent = 'not read';
    readBtn.classList.add('btn');
  }

  const buttonGroup = document.querySelector('.btn-container');
  buttonGroup.appendChild(readBtn);
  buttonGroup.appendChild(removeBtn);
  return container;
}


const getBookFromInput = () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const isRead = document.getElementById('isRead').checked;
  return new Book(title, author, pages, isRead);
}

// conecta todo
const addBook = (e) => {
  e.preventDefault();
  const newBook = getBookFromInput();

  if(library.isInLibrary(newBook)) {
    errorMsg.innerText = 'This book already exists in your library';
    errorMsg.classList.add('active');
    return;
  } else {
    library.addBook(newBook);
    // savelocal();
    updateBooksGrid();
  }

  closeAddBookModal();
  console.log(library.books);
}

addBookBtn.onclick = openAddBookModal;
overlay.onclick = closeAddBookModal;
bookForm.onsubmit = addBook;

/* PROBLEM HERE -> no se actualiza automaticamente 
 1. comprobado que al momento de añadir nuevo book, se crea un objeto diferente
   pero la maquina no lo renderiza 
 2. al momento de presionar "remove", no desaparece 
    el objeto a pesar que se vacía la lista

*/
const deleteBook = (e) => {
   const title = e.target.parentNode.parentNode.querySelector("h1").innerText.replaceAll(
    '"',
    ''
  ).toLowerCase();
  library.removeBook(title);
  // savelocal();

  updateBooksGrid();
}


const toggleRead = (e) => {
  const title = e.target.parentNode.parentNode.querySelector("h1").innerText.replaceAll(
    '"',
    ''
  ).toLowerCase();
  let book = library.getBook(title);
  book.isRead = !book.isRead;
  updateBooksGrid();
  // savelocal();
}



// local storage

// const savelocal = () => {
//   localStorage.setItem('library', JSON.stringify(library.books));
// }

// const restoreLocal = () => {
//   const books = JSON.parse(localStorage.getItem('library'));
//   if(books) {
//     library.books = books.map((book) => JSONToBook(book));
//   } else {
//     []
//   }
//  // library.books = books.map((book) => JSONToBook(book)) || [];
// }


// utils 

// const JSONToBook = (book) => {
//   return new Book(book.title, book.author, book.pages, book.isRead);
// } 

