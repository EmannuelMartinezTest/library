"use strict";
let books = (function () {
    let myLibrary = [];
    // cache DOM
    let main = document.querySelector(".book-container");
    let dialog = document.querySelector("#addBookDialog");
    let addBookButton = document.querySelector(".new-book");
    let form = document.querySelector("form");
    let closeModal = document.querySelector("#close-modal");
    // bind events
    addBookButton.addEventListener("click", dialogShowModal);
    function makeBook(title, author, pages, read) {
        return {
            title,
            author,
            pages,
            read,
        };
    }
    /*
        Initial library
     */
    const theHobbit = makeBook("The Hobbit", "J.R.R. Tolkien", 295, false);
    const theStranger = makeBook("The Stranger", "Albert Camus", 125, true);
    // prettier-ignore
    const callMeByYourName = makeBook("Call Me By Your Name", "Andre Aciman", 230, true);
    addBookToLibrary(theHobbit);
    addBookToLibrary(theStranger);
    addBookToLibrary(callMeByYourName);
    displayLibrary();
    // functions
    function dialogCloseModal() {
        closeModal.removeEventListener("click", dialogCloseModal);
        form.removeEventListener("submit", processBook);
        dialog.close();
    }
    function dialogShowModal() {
        closeModal.addEventListener("click", dialogCloseModal);
        form.addEventListener("submit", processBook);
        dialog.showModal();
    }
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
        const book = makeBook(title, author, pages, read);
        if (!checkRenderedBooks(book)) {
            addBookToLibrary(book);
            displayLibrary();
        }
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
    function addBookToLibrary(book) {
        myLibrary = [...myLibrary, book];
    }
    // prettier-ignore
    function createSelectDropdownWidget(readStatus) {
        const statuses = ["To Read", "Read", "Currently Reading"];
        const selectedIndex = readStatus ? 1 : 0;
        const optionsHTML = statuses
            .map((status, index) => `<option value="${status}" ${index === selectedIndex ? "selected" : ""}>${status}</option>`)
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
    function attachEventListenersToClass(className, eventType, eventHandler) {
        const elements = document.querySelectorAll("." + className);
        elements.forEach((element) => {
            element.removeEventListener(eventType, eventHandler);
            element.addEventListener(eventType, eventHandler);
        });
    }
    function removeBookEventHandler(evt) {
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
    function createBookCard(book, index) {
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
    function checkRenderedBooks(book) {
        var _a, _b;
        for (let bookContainer of main.children) {
            let bookTitle = (_a = bookContainer.querySelector(".title")) === null || _a === void 0 ? void 0 : _a.textContent;
            let bookAuthor = (_b = bookContainer.querySelector(".author")) === null || _b === void 0 ? void 0 : _b.textContent;
            if (bookTitle === book.title && bookAuthor === book.author)
                return true;
        }
        return false;
    }
    return {
        makeBook,
        addBookToLibrary,
        displayLibrary,
    };
})();
