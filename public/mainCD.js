import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { loadUser, loadDB, loadRecebimentos } from "./loaders.js";
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

document.getElementById('statusQt').addEventListener('change', function () { //se não passar o false, ele carrega como true (?) e tenta carregar createTableRowsCD
    const statusQt = document.getElementById('statusQt').value;
    loadRecebimentos(true);
});

loadUser();
console.log('rodou atualizado');
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
            if (document.getElementById('respChegada' + index).value == '') { //
                console.log('entrou no if');
                alert('Preencha o campo de responsavel pelo recebimento');
                return;
            } else {
                console.log(document.getElementById('respChegada' + index).value);
                updates = {
                    Chegada: dataAtual,
                    'Responsavel pelo recebimento': document.getElementById('respChegada' + index).value
                }
            };
        } else if (etapa == 'saida') {
            if (document.getElementById('respSaida' + index).value == '') {
                console.log('entrou no if');
                alert('Preencha o campo de responsavel pela saida');
                return;
            } else {
                console.log('entrou no else');
                updates = {
                    Saida: dataAtual,
                    'Responsavel pela saida': document.getElementById('respSaida' + index).value,
                    'Transportador': document.getElementById('transportador' + index).value
                };
            }
        }
        update(enviosRef, updates);
        loadDB(true);
    }
}