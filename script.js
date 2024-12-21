// Vérifier si l'utilisateur est connecté
let isLoggedIn = sessionStorage.getItem("isLoggedIn") || localStorage.getItem("isLoggedIn");

// Soumettre le formulaire
document.getElementById("submit-form").addEventListener("click", function () {
    if (!isLoggedIn) {
        alert("Veuillez vous connecter avant de soumettre le formulaire !");
        window.location.href = "login.html"; // Redirection vers la page de connexion
        return;
    }

    const dishes = document.getElementById("dishes").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const price = document.getElementById("price").value.trim();

    // Validation des champs
    if (!dishes || !quantity || !price) {
        alert("Tous les champs doivent être remplis !");
        return;
    }
    if (quantity <= 0 || price <= 0) {
        alert("Les quantités et les prix doivent être supérieurs à zéro !");
        return;
    }

    // Désactiver le bouton temporairement
    const submitButton = this;
    submitButton.disabled = true;
    submitButton.textContent = "Envoi...";

    // Ajouter une animation ou un message de succès
    const successMessage = document.createElement("div");
    successMessage.textContent = "Formulaire soumis avec succès !";
    successMessage.style.fontSize = "20px";
    successMessage.style.color = "green";
    successMessage.style.textAlign = "center";
    successMessage.style.marginTop = "20px";
    document.body.appendChild(successMessage);

    // Animation (exemple : effet de "check" ou animation de chargement)
    const animation = document.createElement("div");
    animation.style.width = "50px";
    animation.style.height = "50px";
    animation.style.border = "5px solid #ddd";
    animation.style.borderTop = "5px solid #3498db";
    animation.style.borderRadius = "50%";
    animation.style.animation = "spin 1s linear infinite";
    animation.style.margin = "0 auto";
    document.body.appendChild(animation);

    // Définir une animation CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Rediriger l'utilisateur après 2 secondes
    setTimeout(() => {
        // Supprimer l'animation et le message
        animation.remove();
        successMessage.remove();
        window.location.href = "confirmation.html"; // Redirection vers la page de confirmation
    }, 2000);

    // Réactiver le bouton après l'animation
    setTimeout(() => {
        submitButton.disabled = false; // Réactiver le bouton
        submitButton.textContent = "Soumettre";
    }, 2000);
});
