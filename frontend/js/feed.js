// feed.js

const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

// Redirect if not logged in
if (!token) {
    window.location.href = "login.html";
}

// Load all posts
async function loadPosts() {

    try {

        const response = await fetch(`${API_URL}/posts`, {

            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const posts = await response.json();

        const feed = document.querySelector(".feed");

        feed.innerHTML = "";

        posts.forEach(post => {

            const card = document.createElement("div");

            card.className = "post";

            const hasLiked = post.likes.includes(currentUser.id);

            card.innerHTML = `

                <div class="post-header">

                    <img src="http://localhost:5000/uploads/profile-images/${post.user.profileImage}" alt="User">

                    <div>
                        <h3>${post.user.name}</h3>
                        <small>${new Date(post.createdAt).toLocaleString()}</small>
                    </div>

                </div>

                <img class="post-image"
                src="http://localhost:5000/uploads/post-images/${post.image}"
                alt="Post">

                <div class="actions">

                    <i class="${hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart like-btn"
                       style="color: ${hasLiked ? '#ff4d79' : ''}"
                       data-id="${post._id}"></i>

                    <i class="fa-regular fa-comment"></i>

                    <i class="fa-solid fa-share"></i>

                </div>

                <p><strong>${post.likes.length}</strong> Likes</p>

                <p>${post.caption}</p>

                <button class="comment-btn"
                        data-id="${post._id}">
                        View Comments
                </button>

            `;

            feed.appendChild(card);

        });

        likeEvents();
        commentEvents();

    }

    catch (err) {

        console.error(err);

    }

}

// Like Post

function likeEvents() {

    document.querySelectorAll(".like-btn").forEach(button => {

        button.addEventListener("click", async function () {

            const postId = this.dataset.id;

            try {

                const response = await fetch(`${API_URL}/posts/like/${postId}`, {

                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                });

                const data = await response.json();

                alert(data.message);

                loadPosts();

            }

            catch (err) {

                console.log(err);

            }

        });

    });

}

// View Comments

function commentEvents() {

    document.querySelectorAll(".comment-btn").forEach(button => {

        button.addEventListener("click", function () {

            const id = this.dataset.id;

            window.location.href = `post.html?id=${id}`;

        });

    });

}

// Logout

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

}

// Load Feed

window.onload = loadPosts;