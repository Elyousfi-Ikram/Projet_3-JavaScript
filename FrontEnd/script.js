let reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();
// console.log(works);

reponse = await fetch('http://localhost:5678/api/categories');
const categories = await reponse.json();
// console.log(categories);

const filtres = document.querySelector(".filtres");
const boutonsFiltres = [];
const galerie = document.querySelector(".gallery");

const tous = document.createElement("button");
tous.classList.add("bouton-filtres");
tous.textContent = "Tous";
filtres.appendChild(tous);

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
    buttonFiltre.addEventListener("click", function (event) {
        const boutonClique = event.target.textContent;
        let categoriesFiltrer = works;
    
        if (boutonClique !== "Tous") {
            // Filtrer les œuvres par la catégorie sélectionnée
            categoriesFiltrer = works.filter(work => work.category.name === boutonClique);
        }

        boutonClique.classList.add("activated");
    
        // Affiche les œuvres filtrées
        afficherOeuvres(categoriesFiltrer);
    });
});
