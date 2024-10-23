document.querySelector('#form-login').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const credentials = {
        email: email,
        password: password,
    };

    console.log("credentials", credentials);

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials), // Convertit l'objet en JSON
        });

        console.log(response);

        const data = await response.json();
        console.log("data", data); // Affiche la réponse dans la console
        
        // Si la connexion est réussie, rediriger l'utilisateur vers une autre page
        if (response.ok) {  // Supposons que le serveur renvoie un indicateur de succès
            sessionStorage.setItem("token", data.token);
            window.location.href = "index.html"; // Remplacer par l'URL de redirection souhaitée
        } else {
            // Afficher un message d'erreur à l'utilisateur si besoin
            alert("Connexion échouée, vérifiez vos identifiants");
        }
        
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
    }
});


