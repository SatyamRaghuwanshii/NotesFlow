const newNote = document.querySelector(".note-modal-background");

document.querySelector(".newNote").addEventListener("click", function () {
    newNote.classList.add("openModal");
    newNote.classList.remove("popDown");
    newNote.classList.add("popUp");
});

let closeOrSubmit = () => {
    newNote.classList.remove("popUp");
    newNote.classList.add("popDown");

    setTimeout(() => {
        newNote.classList.remove("openModal");
        newNote.classList.remove("popDown");
    }, 400);
}


document.querySelectorAll(".cancelNote").forEach(btn => {
    btn.addEventListener("click", function () {
        closeOrSubmit();
    })
})


let notes = JSON.parse(localStorage.getItem("notes")) || [];

function createCard() {

    notes.forEach((note, index) => {

        let card = document.createElement("article");
        const cardNo = (index % 4) + 1;

        card.dataset.id = note.id;
        let pin = null;
        if (note.pin) {
            pin = "folder__pin";
        }
        card.classList.add("card", `card--${cardNo}`, "card--folder");

        card.innerHTML = `
        <div class="folder__header">
            <div class="folder__shine"></div>

                <div class="pinCard ${pin}">Pinned</div>

                <div class="folder__title">
                    <span>${note.category}</span>
                    <span>${note.priority}</span>
                </div>
            </div>

        <div class="folder__tab">
            <h3>${note.title}</h3>
            <p>${note.date}</p>
        </div>

        <div class="folder__body">
            <p class="folder__summary">
                ${note.content}
            </p>

            <div class="folder__chips">
                <span>${note.category}</span>
                <span>${note.priority}</span>
            </div>
        </div>`;
        document.querySelector(".stack").appendChild(card)
    });

};
createCard();

const titleInput = document.querySelector("#title input");
const categoryInput = document.querySelector("#category input");
const prioritySelect = document.querySelector("#priority select");
const dateInput = document.querySelector("#date input");
const noteTextarea = document.querySelector("#note textarea");
const saveNoteBtn = document.querySelector("#saveNote");
const noteForm = document.querySelector(".note-form");

let saveToast = () => {
    let toast = document.createElement("div");
    toast.classList.add("toast", "popUp", "toast--success", "glass")
    toast.innerHTML = `
            <div class="toast__dot"></div>
                <div><strong>Note saved</strong>
                <p>Your Note saved in the local</p>
            </div>
        `;
    const toastContainer = document.querySelector(".toasts");

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("popDown");

        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

saveNoteBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const fields = [titleInput, categoryInput, dateInput, noteTextarea];
    if (fields.some(field => !field.value.trim())) {
        let toast = document.createElement("div");
        toast.classList.add("toast", "popUp", "toast--warning", "glass")
        toast.innerHTML = `
            <div class="toast__dot"></div>
                <div><strong>Note Unsaved</strong>
                <p>Note cannot be empty. Please fill the details</p>
            </div>
        `;
        const toastContainer = document.querySelector(".toasts");

        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("popDown");

            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
        return;
    }
    const note = {
        id: Date.now(),
        pin: false,
        title: titleInput.value.trim(),
        category: categoryInput.value.trim(),
        priority: prioritySelect.value,
        date: dateInput.value,
        content: noteTextarea.value.trim(),
        createdAt: new Date().toISOString()
    };

    notes.push(note);
    document.querySelector(".note-form").reset();
    localStorage.setItem("notes", JSON.stringify(notes));
    closeOrSubmit();
    createCard();
});

const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let stack = document.querySelector(".stack");
let cards = stack.children;

function updateCards() {
    for (let i = 0; i < cards.length; i++) {
        let cardNo = (i % 4) + 1;
        cards[i].className = `card card--${cardNo} card--folder`;
    }
}

updateCards();

prevBtn.addEventListener("click", () => {
    stack.appendChild(cards[0])

    cards[cards.length - 1].classList.add("swipe-prev");

    setTimeout(function () {
        updateCards();
        cards[cards.length - 1].classList.remove("swipe-prev")
    }, 450)
});

nextBtn.addEventListener("click", () => {
    stack.prepend(cards[cards.length - 1]);

    updateCards();

    cards[0].classList.add("swipe-next");
    setTimeout(function () {
        cards[0].classList.remove("swipe-next")
    }, 450)

});

let startX = 0;
let activeCard = null;


stack.addEventListener("pointerdown", (e) => {

    if (cards.length <= 4){
        activeCard = document.querySelector(`.card:nth-child(${1})`);
    }else{
        activeCard = document.querySelector(`.card:nth-child(${cards.length})`);
    }
    startX = e.clientX;

});

document.addEventListener("pointermove", (e) => {

    if (!activeCard) return;

    const moveX = e.clientX - startX;

    activeCard.style.transform =
        `translateX(${moveX}px) rotate(${moveX * 0.05}deg)`;

});

stack.addEventListener("pointerup", (e) => {

    if (!activeCard) return;

    const diff = e.clientX - startX;

    if (diff > 100) {
        prevBtn.click();
        activeCard.style.transform = "";
    }
    else if (diff < -100) {
        nextBtn.click();
        activeCard.style.transform = "";
    }
    else {
        activeCard.style.transform = "";
    }

    activeCard = null;

});

stack.addEventListener("selectstart", (e) => {
    e.preventDefault();
});


const overlay = document.querySelector(".card-viewer-overlay");
const viewerCard = document.querySelector(".viewer-card");
const viewerActions = document.querySelector(".viewer-actions");
const backBtn = document.querySelector(".back-btn");
const actionBtns = document.querySelectorAll(".action-btn");
const editBtn = document.querySelector(".action--edit");
const pinBtn = document.querySelector(".action--pin");
const deleteBtn = document.querySelector(".action--delete");
const saveBtn = document.querySelector(".action--save");


let topCard = null;

stack.addEventListener("click", function (e) {

    topCard = e.target.closest(".card--1");

    if (!topCard) return;

    viewerCard.innerHTML = topCard.innerHTML;

    overlay.classList.add("active");
    viewerCard.classList.add("active");

});

backBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
    overlay.classList.add("closing");
    viewerCard.classList.add("closing");

    setTimeout(() => {
        overlay.classList.remove("closing");
        viewerCard.classList.remove("closing");
    }, 350);

});


pinBtn.addEventListener("click", function () {
    const pin = topCard.children[0].children[1];

    const noteId = Number(topCard.dataset.id);
    const note = notes.find(note => note.id === noteId);

    if (!note) return;

    note.pin = !note.pin;

    pin.classList.toggle("folder__pin")
    viewerCard.innerHTML = topCard.innerHTML;

    localStorage.setItem("notes", JSON.stringify(notes));
});

deleteBtn.addEventListener("click", function () {

    const noteId = Number(topCard.dataset.id);
    const note = notes.filter(note => note.id !== noteId);

    if (!note) return;
    
    localStorage.setItem("notes",JSON.stringify(note));
    
    backBtn.click();
    
    createCard()
});

