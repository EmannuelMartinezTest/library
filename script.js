"use strict";
let main = document.querySelector(".book-container");
let dialog = document.querySelector("#addBookDialog");
let addBookButton = document.querySelector(".new-book");
let form = document.querySelector("form");
let deleteBook = document.querySelectorAll(".delete-book");
let closeModal = document.querySelector("#close-modal");
let myLibrary = [];
addBookButton.addEventListener("click", () => {
    dialog.showModal();
});
closeModal.addEventListener("click", (e) => {
    dialog.close();
});
form.addEventListener("submit", processBook);
function removeBookFromList(evt) {
    // prettier-ignore
    if (!(evt.target instanceof HTMLElement && evt.target.parentElement instanceof HTMLElement))
        return;
    let bookParentContainer = evt.target.parentElement;
    let bookDeletionIndex = Number(bookParentContainer.getAttribute("data-index"));
    updateLists(bookDeletionIndex, bookParentContainer);
}
// prettier-ignore
function updateLists(bookDeletionIndex, bookParentContainer) {
    myLibrary.splice(bookDeletionIndex, 1);
    main.removeChild(bookParentContainer);
    displayLibrary();
}
function processBook(evt) {
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
function getInputElementValue(selector) {
    const element = document.querySelector(selector);
    return element ? element.value : "";
}
function getCheckedElementBool(selector) {
    const element = document.querySelector(selector);
    return element ? element.checked : false;
}
function addBookToLibrary(books) {
    myLibrary = [...myLibrary, ...books];
}
function getDropdownWidget(readStatus) {
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
    var _a;
    const fragment = document.createDocumentFragment();
    for (let [index, book] of myLibrary.entries()) {
        // if (checkRenderedBooks(book)) continue;
        // prettier-ignore
        let bookTemplate = (_a = document.querySelector(".book-template")) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
        let bookInfo = bookTemplate.querySelector(".book-info");
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
function checkRenderedBooks(book) {
    for (let bookContainer of main.children) {
        let [bookTitle, bookAuthor] = [
            bookContainer.children[0].children[0].textContent,
            bookContainer.children[0].children[1].textContent,
        ];
        if (bookTitle === book.title && bookAuthor === book.author)
            return true;
    }
    return false;
}
class Book {
    constructor(title, author, pages, read) {
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
