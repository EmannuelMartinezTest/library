let main = document.querySelector(".book-container") as HTMLElement;
let dialog = document.querySelector("#addBookDialog") as HTMLDialogElement;
let addBookButton = document.querySelector(".new-book") as HTMLButtonElement;
let form = document.querySelector("form") as HTMLFormElement;
let closeModal = document.querySelector("#close-modal") as HTMLButtonElement;

let myLibrary: Book[] = [];

addBookButton.addEventListener("click", () => {
  dialog.showModal();
});

closeModal.addEventListener("click", (_) => {
  dialog.close();
});

form.addEventListener("submit", processBook);

function removeBookFromList(evt: Event) {
  // prettier-ignore
  if(!(evt.target instanceof HTMLElement && evt.target.parentElement instanceof HTMLElement) ) return;
  let bookParentContainer = evt.target.parentElement;
  let bookDeletionIndex = Number(
    bookParentContainer.getAttribute("data-index"),
  );
  updateLists(bookDeletionIndex, bookParentContainer);
}

// prettier-ignore
function updateLists(bookDeletionIndex: number, bookParentContainer: HTMLElement) {
  myLibrary.splice(bookDeletionIndex, 1);
  main.removeChild(bookParentContainer);
  displayLibrary();
}

function processBook(evt: Event) {
  evt.preventDefault();

  const title = getInputElementValue("#book-title");
  const author = getInputElementValue("#book-author");
  const pages = Number(getInputElementValue("#book-pages"));
  const read = getCheckedElementBool("#book-read");

  const book = new Book(title, author, pages, read);
  if (!checkRenderedBooks(book)) {
    addBookToLibrary([book]);
    displayLibrary();
  }
  dialog.close();
}

function getInputElementValue(selector: string) {
  const element = document.querySelector(selector) as HTMLInputElement;
  return element ? element.value : "";
}

function getCheckedElementBool(selector: string) {
  const element = document.querySelector(selector) as HTMLInputElement;
  return element ? element.checked : false;
}
function addBookToLibrary(books: Book[]) {
  myLibrary = [...myLibrary, ...books];
}
// prettier-ignore
function createSelectDropdownWidget(readStatus: boolean) {
  const statuses = ["To Read", "Read", "Currently Reading"];
  const selectedIndex = readStatus ? 1 : 0;

  const optionsHTML = statuses
    .map((status, index) =>
        `<option value="${status}" ${index === selectedIndex ? "selected" : ""}>${status}</option>`)
    .join("");

  return `
    <div class="select">
        <select>
            ${optionsHTML}
        </select>
        <span class="focus"></span>
    </div>
  `;
}

function updateDataIndexAttribute() {
  let books = document.querySelectorAll(".book");
  for (let [index, book] of books.entries()) {
    book.setAttribute("data-index", String(index));
  }
}
// prettier-ignore
function attachEventListenersToClass(className: string, eventType: any, eventHandler: any) {
  const elements = document.querySelectorAll("." + className);
  elements.forEach((element) => {
    element.removeEventListener(eventType, eventHandler);
    element.addEventListener(eventType, eventHandler);
  });
}

function removeBookEventHandler(evt: Event) {
  removeBookFromList(evt);
}
function displayLibrary() {
  myLibrary.forEach((book, index) => {
    if (!checkRenderedBooks(book)) {
      const bookCardHTML = createBookCard(book, index);
      main.insertAdjacentHTML("beforeend", bookCardHTML);
    }
  });
  updateDataIndexAttribute();
  attachEventListenersToClass("delete-book", "click", removeBookEventHandler);
}

function createBookCard(book: Book, index: number) {
  const readStatusDropdown = createSelectDropdownWidget(book.read);
  return `
    <div class="book" data-index="${index}">
        <div class="book-info">
            <div class="title">${book.title}</div>
            <div class="author">${book.author}</div>
            <div class="pages">${book.pages}</div>
            ${readStatusDropdown}
        </div>
        <button class="delete-book">x</button>
    `;
}

function checkRenderedBooks(book: Book) {
  for (let bookContainer of main.children) {
    let [bookTitle, bookAuthor] = [
      bookContainer.children[0].children[0].textContent,
      bookContainer.children[0].children[1].textContent,
    ];
    if (bookTitle === book.title && bookAuthor === book.author) return true;
  }
  return false;
}

class Book {
  readonly title: string;
  readonly author: string;
  readonly pages: number;
  readonly read: boolean;
  constructor(title: string, author: string, pages: number, read: boolean) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

/*
    Initial library
 */

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);

const theStranger = new Book("The Stranger", "Albert Camus", 125, true);
// prettier-ignore
const callMeByYourName = new Book("Call Me By Your Name", "Andre Aciman", 230, true);
addBookToLibrary([theHobbit, theStranger, callMeByYourName]);

displayLibrary();
