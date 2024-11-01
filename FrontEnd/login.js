document.querySelector('#form-login').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const credentials = {
        email: email,
        password: password,
    };

    const erreurMessage = document.querySelector(".error-message");
    const btnSubmitConnexion = document.querySelector("#submit-connexion");

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        
        if (response.ok) {  
            sessionStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            erreurMessage.classList.remove("display-none");
        }
        
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
    }
});


