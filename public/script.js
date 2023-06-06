import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCCVI3ns8bDvMKgHX_H5u6y4TeF7uf4K84",
    authDomain: "rastreio-afdb3.firebaseapp.com",
    projectId: "rastreio-afdb3",
    storageBucket: "rastreio-afdb3.appspot.com",
    messagingSenderId: "1002301474873",
    appId: "1:1002301474873:web:fcc09fd36b766c8c77a5e8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", login);
emailInput.addEventListener("change", validateFields);
passwordInput.addEventListener("change", validateFields);

function validateFields() {
    const email = emailInput.value;
    const password = passwordInput.value;

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    btnLogin.disabled = !(isEmailValid && isPasswordValid);
}

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePassword(password) {
    return !!password;
}

//create a login function with firebase auth that redirects user to status.html if login is successful
function login() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then(response => {
            window.location.href = "status.html";
        })
        .catch((error) => {
            alert("Erro ao realizar login");
        });
}