let response = await fetch('http://localhost:5678/api/works');
let works = await response.json();

response = await fetch('http://localhost:5678/api/categories');
const categories = await response.json();

const body = document.querySelector("body")

const filtres = document.querySelector(".filtres");
const boutonsFiltres = [];
const galerie = document.querySelector(".gallery");

const tous = document.createElement("button");

const login = document.querySelector("#login");
const logout = document.querySelector("#logout");

const modeEdition = document.querySelector(".mode-edition")

const gallerieTtitre = document.querySelector("#gallerie-titre")
const modalModifier = document.querySelector(".modal-modifier");
const modal1 = document.querySelector("#modal1");
const btnAjoutPhoto = document.querySelector(".ajout-photo");
const modal2 = document.querySelector("#modal2");

const fileInput = document.getElementById('input-file');
const imagePreview = document.getElementById('imagePreview');

const categoriesSelect = document.querySelector("select#categorie-ajout");

tous.classList.add("bouton-filtres");
tous.textContent = "Tous";
filtres.appendChild(tous);
boutonsFiltres.push(tous);

// ----------------------------------------------------------- CATEGORIE ET BOUTONS FILTRES DANS PAGE HTML ----------------------------------------------------------- //

categories.forEach(categorie => {
    const boutonFiltres = document.createElement("button");
    boutonFiltres.classList.add("bouton-filtres");
    boutonFiltres.textContent = categorie.name;
    filtres.appendChild(boutonFiltres);

    boutonsFiltres.push(boutonFiltres);
});

// Fonction pour afficher les œuvres dans la galerie
function afficherOeuvres(oeuvres) {
    // On vide d'abord la galerie
    galerie.innerHTML = "";

    // Ajout de chaque œuvre dans la galerie
    oeuvres.forEach(work => {
        const workElement = document.createElement("div");
        workElement.classList.add("work-item");
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <p>${work.title}</p>
        `;
        galerie.appendChild(workElement);
    });
}

// Affiche toutes les œuvres au début
afficherOeuvres(works);

boutonsFiltres.forEach(buttonFiltre => {
    buttonFiltre.addEventListener("click", function () {
        const boutonClique = this;

        let categoriesFiltrer = works;

        if (boutonClique.textContent !== "Tous") {
            // Filtrer les œuvres par la catégorie sélectionnée
            categoriesFiltrer = works.filter(work => work.category.name === this.textContent);
        }

        boutonsFiltres.forEach(btn => {
            btn.classList.remove("activated");
        });

        // Ajouter la classe 'activated' au bouton cliqué
        boutonClique.classList.add("activated");

        // Affiche les œuvres filtrées
        afficherOeuvres(categoriesFiltrer);
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
    filtres.classList.add("display-none");
    // modalModifier.classList.remove("display-none");
    gallerieTtitre.classList.add("margin-bottom-gallerie-titre");

} else {                                // l'utilisateur n'est pas connecté
    logout.classList.add("display-none");
    modeEdition.classList.add("display-none")
    filtres.classList.remove("display-none");
    modalModifier.classList.add("display-none");
    gallerieTtitre.classList.remove("margin-bottom-gallerie-titre");
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------//


// --------------------------------------------------------------------------- LES MODALES --------------------------------------------------------------------------- //

// ---------------------------------------------------------------------- OURVIR / FERMER MODALE --------------------------------------------------------------------- //

let openModal = function (modal) {
    modal.classList.remove("display-none");
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", () => closeModal(modal));
    modal.querySelector(".modal-modifier-stop").addEventListener("click", stopPropagation);
    if (modal.querySelector(".modal-back") !== null) {
        modal.querySelector(".modal-back").addEventListener("click", () => closeModal(modal));
    }

    // Charger les œuvres dans la galerie de la modale quand elle s'ouvre
    afficherOeuvresDansModal(works);
};

const closeModal = function (modal) {
    modal.classList.add("display-none");
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-modifier-stop").removeEventListener("click", stopPropagation);
    if (modal.querySelector(".modal-back") !== null) {
        modal.querySelector(".modal-back").removeEventListener("click", closeModal);
    }
};

const stopPropagation = function (e) {
    e.stopPropagation()
};

document.querySelectorAll("a[href*=modal]").forEach((a) => {
    a.addEventListener("click", (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du lien

        let modal = document.querySelector(a.getAttribute("href"));
        openModal(modal); // Appelle openModal avec le bon contexte
    });
});



document.querySelectorAll("button[class~=modal-close]").forEach(btn => {
    btn.addEventListener("click", () => {
        const allVisibleModals = document.querySelectorAll("aside[aria-modal]");

        allVisibleModals.forEach(modal => {
            closeModal(modal);
        })
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------- //

// ----------------------------------------------------------- SUPPRIMER OEUVRES DANS MODAL 1 -------------------------------------------------------------------------//

// Fonction pour afficher les œuvres dans la galerie de la modale avec bouton de suppression
function afficherOeuvresDansModal(oeuvres) {
    const modalGallery = document.querySelector(".modal-gallery");
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
            console.log("button", button)
            const workId = button.getAttribute("data-id");
            console.log("work id", workId);
            await supprimerOeuvre(workId);
            // Filtre la liste des œuvres pour retirer l'élément supprimé
            const nouvelleListe = await (await fetch('http://localhost:5678/api/works')).json();
            afficherOeuvresDansModal(nouvelleListe);
            afficherOeuvres(nouvelleListe);
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
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné

    if (file) {
        const reader = new FileReader(); // Crée un nouvel objet FileReader

        // Définit la fonction à appeler une fois le fichier chargé
        reader.onload = function (e) {
            imagePreview.src = e.target.result; // Définit la source de l'image
            imagePreview.style.display = 'block'; // Affiche l'image
        };

        reader.readAsDataURL(file); // Lit le fichier en tant qu'URL de données
    }
});

categories.forEach(categorie => {
    // Crée un nouvel élément <option> pour chaque catégorie
    const optionCategorie = document.createElement("option");
    optionCategorie.textContent = categorie.name;

    categoriesSelect.appendChild(optionCategorie);
});

const defaultOption = document.createElement("option");
defaultOption.value = "";  // Valeur vide
defaultOption.disabled = true; // Empêche la sélection après choix
defaultOption.selected = true; // Affiche cette option par défaut

categoriesSelect.add(defaultOption, 0);

const addWorkForm = document.querySelector(".form-ajouter-photo");
const btnValidateForm = document.querySelector(".btn-form-valider");
let img = null;
let title = null;
let categorie = null;

addWorkForm.addEventListener("change", () => {
    img = addWorkForm.querySelector("img").src;
    title = addWorkForm.querySelector("input[type=text]").value;
    categorie = addWorkForm.querySelector("select.select").value;

    if (img !== null && title !== '' && categorie !== '') {
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

    console.log("condition", img !== null && title !== '' && categorie !== '');

    response = fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "multipart/form-data"
        },
        body: {
            image: img,
            title: title,
            category: categorie,
        }
    })

    console.log("response", response)

    if (response.ok) {
        response = await fetch('http://localhost:5678/api/works');
        works = response.json();
        afficherOeuvres(works);
    }
});

// ---------------------------------------------------------------------------------------------------------------------------------//