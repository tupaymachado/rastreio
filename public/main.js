import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"
import { loadUser, loadDB, loadEnvios, loadRecebimentos, limpaDB } from "./loaders.js";
import { novoEnvio } from "./util.js";

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

document.getElementById('statusQt').addEventListener('change', function () { //se não passar o false, ele carrega como true (?) e tenta carregar createTableRowsCD
    loadRecebimentos(false);
});
document.getElementById('enviosQt').addEventListener('change', loadEnvios);
document.getElementById('envioBtn').addEventListener('click', novoEnvio);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUser();
    } else {
        alert('Você não está logado')
    }
});

window.confirmReceb = function confirmReceb(index) {
    const confirmacao = confirm("Deseja confirmar o recebimento?");
    if (confirmacao) {
        const data = new Date();
        const enviosRef = ref(database, `envios/${index}`);
        const updates = {
            destino: {
                Chegada: data,
                'Responsavel pelo recebimento': user // Substitua por user.value se necessário
            }
        };
        update(enviosRef, updates)
            .then(() => {
                console.log("Dados de recebimento atualizados com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao atualizar os dados de recebimento:", error);
            });
    }
}