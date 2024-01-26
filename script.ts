let main = document.querySelector(".book-container") as HTMLElement;
let dialog = document.querySelector("#addBookDialog") as HTMLDialogElement;
let addBookButton = document.querySelector(".new-book") as HTMLButtonElement;
let form = document.querySelector("form") as HTMLFormElement;
let deleteBook = document.querySelectorAll(".delete-book");
let closeModal = document.querySelector("#close-modal") as HTMLButtonElement;

let myLibrary: Book[] = [];

addBookButton.addEventListener("click", () => {
  dialog.showModal();
});

closeModal.addEventListener("click", (e) => {
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
  addBookToLibrary([book]);
  displayLibrary();
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

function getDropdownWidget(readStatus: boolean) {
  let dropdownContainer = document.createElement("div");
  dropdownContainer.className = "select";

  let statuses = ["To Read", "Read", "Currently Reading"];
  let dropdown = document.createElement("select");

  for (let [index] of statuses.entries()) {
    let option = document.createElement("option");
    option.value = statuses[index];
    option.text = statuses[index];
    dropdown.appendChild(option);
  }

  dropdown.selectedIndex = readStatus ? 1 : 0;

  dropdownContainer.appendChild(dropdown);

  let spanFocus = document.createElement("span");
  spanFocus.className = "focus";

  dropdownContainer.appendChild(spanFocus);

  return dropdownContainer;
}
function displayLibrary() {
  const fragment = document.createDocumentFragment();
  for (let [index, book] of myLibrary.entries()) {
    // if (checkRenderedBooks(book)) continue;
    // prettier-ignore
    let bookTemplate = document.querySelector(".book-template")?.cloneNode(true) as HTMLElement;
    let bookInfo = bookTemplate.querySelector(".book-info") as HTMLElement;
    let fields = bookInfo.children;

    bookTemplate.className = "book";

    bookTemplate.setAttribute("data-index", String(index));

    for (let child of fields) {
      let className = child.className;
      switch (className) {
        case "title":
          child.textContent = book.title;
          break;
        case "author":
          child.textContent = book.author;
          break;
        case "pages":
          child.textContent = String(book.pages);
          break;
        case "read":
          bookInfo.replaceChild(getDropdownWidget(book.read), child);
          break;
      }
    }
    main.innerHTML = "";
    fragment.appendChild(bookTemplate);
  }

  main.appendChild(fragment);
  deleteBook = document.querySelectorAll(".delete-book");
  deleteBook.forEach((button) => {
    button.addEventListener("click", removeBookFromList);
  });
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
    Initial start-up
 */

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);

const theStranger = new Book("The Stranger", "Albert Camus", 125, true);
// prettier-ignore
const callMeByYourName = new Book("Call Me By Your Name", "Andre Aciman", 230, true);
addBookToLibrary([theHobbit, theStranger, callMeByYourName]);

displayLibrary();
