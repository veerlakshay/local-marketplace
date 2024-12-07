import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";


//register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then((registration) => {
                console.log("ServiceWorker registered: ", registration);
            })
            .catch((registrationError) => {
                console.log("ServiceWorker registration failed: ", registrationError);
            });
    });
}

// DOM Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// Handle Signup
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            alert("Account created successfully!");
            window.location.href = "index.html";
        } catch (error) {
            alert(`Signup Error: ${error.message}`);
        }
    });
}

// Handle Login
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
            window.location.href = "view-products.html";
        } catch (error) {
            alert(`Login Error: ${error.message}`);
        }
    });
}

// Function to convert an image file to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Function to compress an image using Compressor.js
function compressImage(file) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.6, // Compression quality (0 to 1)
            maxWidth: 800, // Maximum width for the compressed image
            maxHeight: 800, // Maximum height for the compressed image
            success: (compressedFile) => resolve(compressedFile),
            error: (error) => reject(error),
        });
    });
}

// Function to post an ad
export async function postAd(title, description, price, contact, file) {
    try {
        if (!auth.currentUser) {
            throw new Error("User is not logged in.");
        }

        const userId = auth.currentUser.uid;

        // Compress the image file
        const compressedFile = await compressImage(file);

        // Convert the compressed image file to Base64
        const imageBase64 = await convertToBase64(compressedFile);

        // Save ad data to Firestore
        const adData = {
            title,
            description,
            price: parseFloat(price),
            contact,
            imageBase64, // Store Base64 image data
            userId,
            createdAt: new Date().toISOString(),
        };

        await addDoc(collection(db, "ads"), adData);

        alert("Ad posted successfully!");
    } catch (error) {
        console.error("Error posting ad:", error);
        alert("Failed to post ad. Please try again.");
    }
}


// View Products

export async function viewProducts() {
    try {
        const productsContainer = document.getElementById("products-container");
        productsContainer.innerHTML = ""; // Clear existing products

        const querySnapshot = await getDocs(collection(db, "ads"));
        querySnapshot.forEach((doc) => {
            const product = doc.data();

            // Create a product card
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.imageBase64}" alt="${product.title}" />
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Contact:</strong> ${product.contact}</p>
            `;

            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error retrieving products:", error);
        alert("Failed to load products.");
    }
}

// Function to log out
export function logout() {
    console.log("log out btn pressed")
    signOut(auth)
        .then(() => {
            alert("You have successfully logged out.");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error during logout:", error);
            alert("Failed to log out. Please try again.");
        });
}

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (!user && window.location.pathname !== "/index.html" && window.location.pathname !== "/signup.html") {
        window.location.href = "index.html";
    }
});
