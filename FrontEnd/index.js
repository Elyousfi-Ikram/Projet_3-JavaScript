let response = await fetch('http://localhost:5678/api/works');
let works = await response.json();

response = await fetch('http://localhost:5678/api/categories');
const categories = await response.json();

const filters = document.querySelector(".filters");
const buttonsFilters  = [];
const gallery = document.querySelector(".gallery");

const tous = document.createElement("button");

const login = document.querySelector("#login");
const logout = document.querySelector("#logout");

const modeEdition = document.querySelector(".mode-edition");
const header = document.querySelector("header");

const galleryTitle = document.querySelector("#gallery-title");
const linkModal = document.querySelector(".link-modal");
const modalWorkDelete = document.querySelector("#modal-work-delete");
const btnAjoutPhoto = document.querySelector(".btn-modal-add");
const modalWorkAdd = document.querySelector("#modal-work-add");

const fileInput = document.getElementById('input-file');
const imagePreview = document.getElementById('imagePreview');

const categoriesSelect = document.querySelector("select#category-add");

tous.classList.add("galleryTitles");
tous.textContent = "Tous";
filters.appendChild(tous);
buttonsFilters .push(tous);

const formWorkAdd = modalWorkAdd.querySelector(".form-add");


// ----------------------------------------------------------- CATEGORIE ET BOUTONS FILTRES DANS PAGE HTML ----------------------------------------------------------- //

categories.forEach(categorie => {
    const buttonFilters  = document.createElement("button");
    buttonFilters .classList.add("galleryTitles");
    buttonFilters .textContent = categorie.name;
    filters.appendChild(buttonFilters );

    buttonsFilters .push(buttonFilters );
});

// Fonction pour afficher les œuvres dans la galerie
function displayWorks(oeuvres) {
    // On vide d'abord la galerie
    gallery.innerHTML = "";

    // Ajout de chaque œuvre dans la galerie
    oeuvres.forEach(work => {
        const workElement = document.createElement("div");
        workElement.classList.add("work-item");
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <p>${work.title}</p>
        `;
        gallery.appendChild(workElement);
    });
}

// Affiche toutes les œuvres au début
displayWorks(works);

buttonsFilters .forEach(buttonFiltre => {
    buttonFiltre.addEventListener("click", function () {
        const buttonClick = this;

        let categoriesFilter = works;

        if (buttonClick.textContent !== "Tous") {
            // Filtrer les œuvres par la catégorie sélectionnée
            categoriesFilter = works.filter(work => work.category.name === this.textContent);
        }

        buttonsFilters .forEach(btn => {
            btn.classList.remove("activated");
        });

        // Ajouter la classe 'activated' au bouton cliqué
        buttonClick.classList.add("activated");

        // Affiche les œuvres filtrées
        displayWorks(categoriesFilter);
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------- //


// ------------------------------------------------------------------------- LOGIN / LOGOUT -------------------------------------------------------------------------- //

document.querySelector("#logout").addEventListener("click", (event) => {
    event.preventDefault();

    sessionStorage.removeItem("token");
    window.location.href = "index.html";
});

if (sessionStorage.getItem("token")) {  // l'utilisateur est connecté

    login.classList.add("display-none");
    logout.classList.remove("display-none");
    filters.classList.add("display-none");
    galleryTitle.classList.add("margin-bottom-gallery-title");
    header.classList.add("padding-header-mode-edition");

} else {                                // l'utilisateur n'est pas connecté
    logout.classList.add("display-none");
    modeEdition.classList.add("display-none")
    filters.classList.remove("display-none");
    linkModal.classList.add("display-none");
    galleryTitle.classList.remove("margin-bottom-gallery-title");
    header.classList.remove("padding-header-mode-edition");

}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------//


// --------------------------------------------------------------------------- LES MODALES --------------------------------------------------------------------------- //

// ---------------------------------------------------------------------- OURVIR / FERMER MODALE --------------------------------------------------------------------- //

const openModal = function (modal) {
    modal.classList.remove("display-none");
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", () => closeModal(modal));
    modal.querySelector("div[class^=modal-work").addEventListener("click", stopPropagation);

    if (modal.querySelector(".modal-back") !== null) {
        modal.querySelector(".modal-back").addEventListener("click", () => closeModal(modal));
    }

    // Charger les œuvres dans la galerie de la modale quand elle s'ouvre
    displayWorksInModal(works);
    
};

const closeModal = function (modal) {
    modal.classList.add("display-none");
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector("div[class^=modal-work").removeEventListener("click", stopPropagation);

    if (modal.querySelector(".modal-back") !== null) {
        modal.querySelector(".modal-back").removeEventListener("click", closeModal);
    }
};

const stopPropagation = function (e) {
    e.stopPropagation()
};

const closeAllVisibleModals = () => {
    const allVisibleModals = document.querySelectorAll("aside[aria-modal]");

    allVisibleModals.forEach(modal => {
        closeModal(modal);
    });
};

const resetFormWorkAdd = () => {
    formWorkAdd.reset();
    imagePreview.src = "";
    imagePreview.classList.add("display-none"); // Cache l'image
};

document.querySelector(".link-modal").addEventListener("click", () => {
    openModal(modalWorkDelete);
});

btnAjoutPhoto.addEventListener("click", () => {
    openModal(modalWorkAdd);
});

document.querySelectorAll("button[class~=modal-close]").forEach(btn => {
    btn.addEventListener("click", () => {
        closeAllVisibleModals();
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------- //

// ----------------------------------------------------------- SUPPRIMER OEUVRES DANS MODAL 1 -------------------------------------------------------------------------//

// Fonction pour afficher les œuvres dans la galerie de la modale avec bouton de suppression
function displayWorksInModal(oeuvres) {
    const modalGallery = document.querySelector(".gallery-content");
    modalGallery.innerHTML = "";

    oeuvres.forEach(work => {
        const workElement = document.createElement("div");
        workElement.classList.add("work-item");
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="delete-work" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
        `;
        modalGallery.appendChild(workElement);
    });

    // Ajouter l'écouteur pour les boutons de suppression
    document.querySelectorAll(".delete-work").forEach(button => {
        button.addEventListener("click", async function () {
            const workId = button.getAttribute("data-id");

            await supprimerOeuvre(workId);
            // Filtre la liste des œuvres pour retirer l'élément supprimé
            works = await (await fetch('http://localhost:5678/api/works')).json();
            displayWorksInModal(works);
            displayWorks(works);
        });
    });
};

// Fonction pour supprimer une œuvre
async function supprimerOeuvre(workId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,  // Authentification si requise
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            console.log(`L'œuvre avec l'ID ${workId} a été supprimée avec succès.`);
        } else {
            console.error("Erreur lors de la suppression de l'œuvre.");
        }
    } catch (error) {
        console.error("Erreur réseau lors de la tentative de suppression :", error);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------- //

// -------------------------------------------------------------------- AJOUTER PHOTO DANS MODAL 2 ------------------------------------------------------------------- //

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné^

    if (file) {
        const reader = new FileReader(); // Crée un nouvel objet FileReader

        // Définit la fonction à appeler une fois le fichier chargé
        reader.onload = function (event) {
            imagePreview.src = event.target.result; // Définit la source de l'image
            imagePreview.classList.remove("display-none"); // Affiche l'image
        };

        reader.readAsDataURL(file); // Lit le fichier en tant qu'URL de données
    }
});

const defaultOption = document.createElement("option");
defaultOption.setAttribute("disabled", "disabled"); // Empêche la sélection après choix
defaultOption.setAttribute("selected", "selected"); // Affiche cette option par défaut

categoriesSelect.appendChild(defaultOption);

categories.forEach(categorie => {
    // Crée un nouvel élément <option> pour chaque catégorie
    const optionCategorie = document.createElement("option");
    optionCategorie.textContent = categorie.name;

    categoriesSelect.appendChild(optionCategorie);
});

const addWorkForm = document.querySelector(".form-add");
const btnValidateForm = document.querySelector(".btn-form-validated");
let img = null;
let title = null;
let categorieName = null;

addWorkForm.addEventListener("change", () => {
    img = addWorkForm.querySelector("input[type=file]").files[0];
    title = addWorkForm.querySelector("input[type=text]").value;
    categorieName = addWorkForm.querySelector("select.select-category").value;

    if (img !== '' && title !== '' && categorieName !== '') {
        btnValidateForm.removeAttribute("disabled");
        btnValidateForm.classList.remove("btn-grey");
        btnValidateForm.classList.add("btn-green");
    } else {
        btnValidateForm.setAttribute("disabled", "disabled");
        btnValidateForm.classList.remove("btn-green");
        btnValidateForm.classList.add("btn-grey");
    }
});

btnValidateForm.addEventListener("click", async (event) => {
    event.preventDefault();
    const categorieId = categories.filter(categorie => categorie.name === categorieName)[0].id;

    const body = new FormData();
    body.append("image", img);       // Assurez-vous que `img` est un fichier ou un Blob.
    body.append("title", title);
    body.append("category", categorieId);

    response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "accept": "application/json",
            // "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + sessionStorage.getItem('token')
        },
        body: body
    });

    if (response.status === 201) {
        response = await fetch('http://localhost:5678/api/works');
        works = await response.json();
        displayWorks(works);

        closeAllVisibleModals();
        resetFormWorkAdd();
    }
});

// ---------------------------------------------------------------------------------------------------------------------------------//

