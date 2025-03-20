document.addEventListener("DOMContentLoaded", async () => {
    const videoList = document.getElementById("video-list");
    const username = document.getElementById("username");

    // Set logged-in username (Replace with actual login system)
    username.textContent = localStorage.getItem("userName") || "Guest";

    // Fetch Videos from Supabase
    async function fetchVideos() {
        try {
            let response = await fetch("/get-videos");
            let videos = await response.json();

            videos.forEach(video => {
                let videoElement = document.createElement("video");
                videoElement.src = video.url;
                videoElement.controls = true;
                videoList.appendChild(videoElement);
            });
        } catch (error) {
            console.error("Error loading videos:", error);
        }
    }

    fetchVideos();

    // Upload Video Function
    document.getElementById("upload-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        let file = document.getElementById("video-upload").files[0];
        if (!file) {
            alert("Please select a video.");
            return;
        }

        let formData = new FormData();
        formData.append("video", file);
        formData.append("uploadedBy", localStorage.getItem("userName") || "Anonymous");

        try {
            let response = await fetch("/upload-video", {
                method: "POST",
                body: formData
            });

            let result = await response.json();
            if (result.success) {
                alert("Video uploaded successfully!");
                location.reload();
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    });
});
