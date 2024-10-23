let reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

reponse = await fetch('http://localhost:5678/api/categories');
const categories = await reponse.json();

const filtres = document.querySelector(".filtres");
const boutonsFiltres = [];
const galerie = document.querySelector(".gallery");

const tous = document.createElement("button");

const login = document.querySelector("#login");
const logout = document.querySelector("#logout");

const divModifier = document.querySelector("#div-modifier")

const boutonModifier = document.querySelector("#bouton-modifier");

tous.classList.add("bouton-filtres");
tous.textContent = "Tous";
filtres.appendChild(tous);
boutonsFiltres.push(tous);

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

document.querySelector("#logout").addEventListener("click", (event) => {
    event.preventDefault();

    sessionStorage.removeItem("token");
    window.location.href = "index.html";
});


if (sessionStorage.getItem("token")) {  // l'utilisateur est connecté
    // console.log("token", sessionStorage.getItem("token"));
    login.classList.add("display-none");
    logout.classList.remove("display-none");
    boutonModifier.classList.remove("display-none");
    filtres.classList.add("display-none");
    divModifier.classList.add("margin-bottom-div-modifier");
    
} else {                                // l'utilisateur n'est pas connecté
    logout.classList.add("display-none");
    boutonModifier.classList.add("display-none");
    filtres.classList.remove("display-none");
    divModifier.classList.remove("margin-bottom-div-modifier");
}
