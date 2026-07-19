// post.js

const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

// Redirect if not logged in
if (!token) {
    window.location.href = "login.html";
}

const headers = {
    Authorization: `Bearer ${token}`
};

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

if (!postId) {
    alert("Post ID is missing.");
    window.location.href = "feed.html";
}

// Load post details and comments on startup
document.addEventListener("DOMContentLoaded", () => {
    loadPost();
    loadComments();
});

// Load Single Post Details
async function loadPost() {
    const postContainer = document.getElementById("postContainer");

    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: "GET",
            headers
        });

        if (!response.ok) {
            postContainer.innerHTML = `<p style="text-align: center; color: red;">Post not found or has been deleted.</p>`;
            return;
        }

        const post = await response.json();
        
        postContainer.innerHTML = `
            <div class="post" style="max-width: 100%;">
                <div class="post-header">
                    <img src="http://localhost:5000/uploads/profile-images/${post.user.profileImage}" alt="User">
                    <div>
                        <h3>${post.user.name}</h3>
                        <small>${new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                </div>

                ${post.image ? `<img class="post-image" src="http://localhost:5000/uploads/post-images/${post.image}" alt="Post">` : ''}

                <div class="actions">
                    <i class="${post.likes.includes(currentUser.id) ? 'fa-solid' : 'fa-regular'} fa-heart like-btn" 
                       style="color: ${post.likes.includes(currentUser.id) ? '#ff4d79' : ''}"
                       onclick="likePost()"></i>
                    <i class="fa-regular fa-comment"></i>
                    <i class="fa-solid fa-share"></i>
                </div>

                <p><strong>${post.likes.length}</strong> Likes</p>
                <p>${post.caption}</p>
            </div>
        `;

    } catch (error) {
        console.error("Error loading post:", error);
        postContainer.innerHTML = `<p style="text-align: center; color: red;">Error loading post details.</p>`;
    }
}

// Like / Unlike Post
async function likePost() {
    try {
        const response = await fetch(`${API_URL}/posts/like/${postId}`, {
            method: "POST",
            headers
        });

        if (response.ok) {
            loadPost();
        }
    } catch (error) {
        console.error("Error liking post:", error);
    }
}

// Load Comments for Post
async function loadComments() {
    const commentsList = document.getElementById("commentsList");

    try {
        const response = await fetch(`${API_URL}/comments/${postId}`, {
            method: "GET",
            headers
        });

        const comments = await response.json();
        commentsList.innerHTML = "";

        if (!Array.isArray(comments) || comments.length === 0) {
            commentsList.innerHTML = `<p class="no-comments">No comments yet. Be the first to share your thoughts!</p>`;
            return;
        }

        comments.forEach(comment => {
            const commentItem = document.createElement("div");
            commentItem.className = "comment-item";

            // Allow delete if comment author is current user OR post author is current user
            const isCommentAuthor = comment.user._id === currentUser.id;
            
            commentItem.innerHTML = `
                <img src="http://localhost:5000/uploads/profile-images/${comment.user.profileImage}" alt="User">
                <div class="comment-content">
                    <h4>${comment.user.name} <span style="font-weight: 300; font-size: 11px; color: #777; margin-left: 5px;">${new Date(comment.createdAt).toLocaleDateString()}</span></h4>
                    <p>${comment.comment}</p>
                    ${isCommentAuthor ? `
                        <button class="delete-comment-btn" onclick="deleteComment('${comment._id}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    ` : ''}
                </div>
            `;

            commentsList.appendChild(commentItem);
        });

    } catch (error) {
        console.error("Error loading comments:", error);
        commentsList.innerHTML = `<p style="text-align: center; color: red;">Error loading comments.</p>`;
    }
}

// Add New Comment
const commentForm = document.getElementById("commentForm");
commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const commentText = document.getElementById("commentText").value.trim();
    if (!commentText) return;

    try {
        const response = await fetch(`${API_URL}/comments/${postId}`, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ comment: commentText })
        });

        if (response.ok) {
            document.getElementById("commentText").value = "";
            loadComments();
        } else {
            const data = await response.json();
            alert(data.message || "Failed to add comment.");
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        alert("Server connection error.");
    }
});

// Delete Comment
async function deleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: "DELETE",
            headers
        });

        if (response.ok) {
            loadComments();
        } else {
            const data = await response.json();
            alert(data.message || "Failed to delete comment.");
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
}
