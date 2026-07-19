// createPost.js

const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

// Check Login
if (!token) {
    window.location.href = "login.html";
}

const createPostForm = document.getElementById("createPostForm");

createPostForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const caption = document.getElementById("caption").value.trim();
    const image = document.getElementById("postImage").files[0];

    if (!caption && !image) {
        alert("Please enter a caption or select an image.");
        return;
    }

    const formData = new FormData();

    formData.append("caption", caption);

    if (image) {
        formData.append("image", image);
    }

    try {

        const response = await fetch(`${API_URL}/posts`, {

            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData

        });

        const data = await response.json();

        if (response.ok) {

            alert("Post created successfully!");

            createPostForm.reset();

            document.getElementById("previewImage").style.display = "none";

            window.location.href = "feed.html";

        } else {

            alert(data.message || "Failed to create post.");

        }

    } catch (error) {

        console.error(error);

        alert("Server connection failed.");

    }

});

// Image Preview

const postImage = document.getElementById("postImage");
const previewImage = document.getElementById("previewImage");

postImage.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        previewImage.src = URL.createObjectURL(file);

        previewImage.style.display = "block";

    } else {

        previewImage.style.display = "none";

    }

});

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}