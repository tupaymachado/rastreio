import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";


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
document.getElementById("resetPasswordBtn").addEventListener("click", function () {
    resetPassword('tupay.machado@gmail.com')
});

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

function login() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            localStorage.setItem("uid", uid);
            const userRef = ref(database, `users/${uid}`);
            return new Promise((resolve, reject) => {
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    resolve(data);
                }, (error) => {
                    reject(error);
                });
            });
        })
        .then((data) => {
            if (data == 'CD') {
                window.location.href = "mainCD.html";
            } else {
                window.location.href = "main.html";
            }
        })
        .catch((error) => {
            console.log(error.code);
            alert("Erro ao realizar login");
        });
}

function resetPassword(email) {
    const form = document.getElementsByClassName('loginForm')[0];
    form.style.display = 'none';
    const message = document.createElement('p');
    message.innerHTML = 'Um email de redefinição de senha foi enviado para o endereço informado. <br> Caso não receba o email, verifique sua caixa de spam.';
    document.getElementById('resetPasswordContainer').appendChild(message);
    const returnBtn = document.createElement('button');
    returnBtn.innerHTML = 'Voltar';
    returnBtn.className = 'btn btn-primary';
    returnBtn.addEventListener('click', function () {
        window.location.reload();
    });
    document.getElementById('resetPasswordContainer').appendChild(returnBtn);
    
    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Email de redefinição de senha enviado com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao enviar email de redefinição de senha:", error);
        });
}