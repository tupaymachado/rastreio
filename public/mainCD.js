import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { loadUser, loadDB } from "./loaders.js";
import { novoEnvio, confirmReceb } from "./util.js";

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

loadUser();

window.confirmCD = function confirmReceb(index, etapa) { //essa merda só funciona se eu colocar o window. antes
    const confirmacao = confirm("Deseja confirmar o recebimento?");
    if (confirmacao) {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        const dataAtual = `${dia}/${mes}/${ano}`;
        const enviosRef = ref(database, `envios/${index}/cd`);
        let updates = {};
        if (etapa == 'chegada') {
            const id = 'respChegada' + index;
            console.log(id)
            updates = {
                Chegada: dataAtual,
                'Responsavel pelo recebimento': document.getElementById('respChegada'+index).value //arrumar para ele pegar o .value do input da tabela
            };
        } else if (etapa == 'saida') {
            updates = {
                Saida: dataAtual,
                'Responsavel pela saida': document.getElementById('respSaida' + index).value, //arrumar para ele pegar o .value do input da tabela
                'Transportador': document.getElementById('transportador' + index).value
            };
        }
        update(enviosRef, updates); //atualiza o banco de dados
        loadDB(true);
    }
}