document.getElementById("versesForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        interests: document.getElementById("interests").value,
        reason: document.getElementById("reason").value,
        contribute: document.querySelector('input[name="contribute"]:checked')?.value || "No",
        improvements: document.getElementById("improvements").value
    };

    localStorage.setItem("userName", formData.name);  // Save name for landing page

    try {
        const response = await fetch("http://127.0.0.1:5000/submit-form", {  // Ensure this matches your backend
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Form submitted successfully!");
            window.location.href = "landing.html";  // Redirect to landing page
        } else {
            const errorData = await response.json();
            alert("Error submitting form: " + errorData.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
