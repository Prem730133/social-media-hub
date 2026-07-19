// register.js

const API_URL = "http://localhost:5000/api";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const bio = document.getElementById("bio").value.trim();
    const profileImage = document.getElementById("profileImage").files[0];

    // Validation

    if (
        !name ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        alert("Please fill all required fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);

    if (profileImage) {
        formData.append("profileImage", profileImage);
    }

    try {

        const response = await fetch(`${API_URL}/auth/register`, {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        if (response.ok) {

            alert("Registration Successful!");

            window.location.href = "login.html";

        } else {

            alert(data.message || "Registration failed.");

        }

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }

});