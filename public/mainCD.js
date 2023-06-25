import { ref, update, database } from ".config.js";
import { loadUser, loadDB, loadRecebimentos } from "./loaders.js";

const uid = localStorage.getItem('uid');

document.getElementById('statusQt').addEventListener('change', function () { //se não passar o false, ele carrega como true (?) e tenta carregar createTableRowsCD
    const statusQt = document.getElementById('statusQt').value;
    loadRecebimentos(true);
});

loadUser();

window.confirmCD = function confirmReceb(index, etapa) { //essa merda só funciona se eu colocar o window
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
    }
}