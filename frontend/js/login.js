// login.js

const API_URL = "http://localhost:5000/api";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            // Save JWT Token
            localStorage.setItem("token", data.token);

            // Save User
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login Successful!");

            window.location.href = "index.html";

        } else {

            alert(data.message || "Invalid Email or Password");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});