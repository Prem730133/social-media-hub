// profile.js

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileBio = document.getElementById("profileBio");

const postCount = document.getElementById("postCount");
const followerCount = document.getElementById("followerCount");
const followingCount = document.getElementById("followingCount");

const editForm = document.getElementById("editProfileForm");
const imageInput = document.getElementById("imageInput");

// Load Profile
async function loadProfile() {

    try {

        const response = await fetch(`${API_URL}/users/profile`, {

            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const user = await response.json();

        profileName.textContent = user.name;
        profileUsername.textContent = "@" + user.username;
        profileBio.textContent = user.bio;

        postCount.textContent = user.posts || 0;
        followerCount.textContent = user.followers.length;
        followingCount.textContent = user.following.length;

        if (user.profileImage) {
            profileImage.src = `http://localhost:5000/uploads/profile-images/${user.profileImage}`;
        }

        // Populate edit form fields
        const nameInput = document.querySelector('input[name="name"]');
        const bioInput = document.querySelector('textarea[name="bio"]');
        if (nameInput) nameInput.value = user.name || "";
        if (bioInput) bioInput.value = user.bio || "";

    } catch (error) {

        console.log(error);

    }

}

// Toggle Edit Profile Section
document.addEventListener("DOMContentLoaded", () => {
    const editProfileSection = document.querySelector(".edit-profile");
    const editBtn = document.querySelector(".edit-btn");
    
    if (editProfileSection) {
        editProfileSection.style.display = "none";
    }
    
    if (editBtn && editProfileSection) {
        editBtn.addEventListener("click", () => {
            if (editProfileSection.style.display === "none") {
                editProfileSection.style.display = "block";
            } else {
                editProfileSection.style.display = "none";
            }
        });
    }
});

// Preview Profile Image

if (imageInput) {

    imageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (file) {

            profileImage.src = URL.createObjectURL(file);

        }

    });

}

// Update Profile

if (editForm) {

    editForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData(editForm);

        try {

            const response = await fetch(`${API_URL}/users/profile`, {

                method: "PUT",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData

            });

            const result = await response.json();

            alert(result.message);

            loadProfile();

        } catch (error) {

            console.log(error);

        }

    });

}

// Logout

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

}

// Load data when page opens

window.onload = loadProfile;