// Base URL of the backend API
const API_URL = "http://localhost:5000/api";

// Load latest posts when index.html is opened
document.addEventListener("DOMContentLoaded", () => {
    loadLatestPosts();
});

// Fetch latest posts from backend
async function loadLatestPosts() {
    const postContainer = document.getElementById("postContainer");

    // If this page doesn't contain the post container, do nothing
    if (!postContainer) return;

    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();

        postContainer.innerHTML = "";

        if (!Array.isArray(posts) || posts.length === 0) {
            postContainer.innerHTML =
                "<p style='text-align:center;'>No posts available.</p>";
            return;
        }

        // Display up to 3 posts on landing page preview
        posts.slice(0, 3).forEach(post => {

            const image =
                post.image ? `http://localhost:5000/uploads/post-images/${post.image}` : "images/post1.jpg";

            const username =
                post.user?.name || post.user?.username || "Unknown User";

            const caption =
                post.caption || "";

            const likes =
                post.likes ? post.likes.length : 0;

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${image}" class="post-image" alt="Post Image" style="width:100%; height:200px; object-fit:cover; border-radius:10px; margin-bottom:15px;">
                <div class="post-content">
                    <h3>${username}</h3>
                    <p style="margin: 10px 0; color:#555;">${caption}</p>
                    <p><strong>❤️ ${likes} Likes</strong></p>
                </div>
            `;

            postContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading posts:", error);

        postContainer.innerHTML =
            "<p style='text-align:center;color:red;'>Unable to load posts.</p>";
    }
}

// Logout user
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}

// Attach logout event if logout button exists
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        logout();
    });
}
