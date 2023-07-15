import { ref, update, database } from "./config.js";
import { loadUser, loadRecebimentos } from "./loaders.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"

document.getElementById('quant').addEventListener('change', function () { //se não passar o false, ele carrega como true (?) e tenta carregar createTableRowsCD
    const quant = document.getElementById('quant').value;
    loadRecebimentos(true);
});

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUser();
    } else {
        alert('Você não está logado')
    }
});

window.confirmCD = function confirmReceb(index, etapa) { //essa merda só funciona se eu colocar o window
    const confirmacao = confirm("Deseja confirmar o recebimento?");
    console.log('teste');
    if (confirmacao) {        
        const data = new Date();
        const enviosRef = ref(database, `envios/${index}/cd`);
        let updates = {};
        if (etapa == 'chegada') {
            if (document.getElementById('respChegada' + index).value == '') { 
                alert('Preencha o campo de responsavel pelo recebimento');
                return;
            } else {
                updates = {
                    Chegada: data,
                    'Responsavel pelo recebimento': document.getElementById('respChegada' + index).value
                }
            };
        } else if (etapa == 'saida') {
            if (document.getElementById('respSaida' + index).value == '' || document.getElementById('transportador' + index).value == '') {
                alert('Preencha ambos os campos - responsavel pela saida e transportador');
                return;
            } else {
                updates = {
                    Saida: data,
                    'Responsavel pela saida': document.getElementById('respSaida' + index).value,
                    'Transportador': document.getElementById('transportador' + index).value
                };
            }
        }
        update(enviosRef, updates);
    }
}