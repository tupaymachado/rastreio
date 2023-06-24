import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { loadDB, loadUser, loadEnvios, loadRecebimentos } from "./loaders.js";
import { novoEnvio } from "./util.js";
import { createTableRows, createStatusColumn } from "./createTable.js";

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
const uid = localStorage.getItem('uid');

document.getElementById('statusQt').addEventListener('change', function () { //se não passar o false, ele carrega como true (?) e tenta carregar createTableRowsCD
    const statusQt = document.getElementById('statusQt').value;
    loadRecebimentos(false);
});
document.getElementById('enviosQt').addEventListener('change', loadEnvios);
document.getElementById('envioBtn').addEventListener('click', novoEnvio);

loadUser();

window.confirmReceb = function confirmReceb(index) { //essa merda só funciona se eu colocar o window. antes
    const confirmacao = confirm("Deseja confirmar o recebimento?");
    if (confirmacao) {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        const dataAtual = `${dia}/${mes}/${ano}`;
        const enviosRef = ref(database, `envios/${index}/destino`);
        const updates = {
            Chegada: dataAtual,
            'Responsavel pelo recebimento': user //arrumar para ele pegar o .value do input da tabela
        };
        update(enviosRef, updates); //atualiza o banco de dados
        loadDB();
    }
}
