import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { database } from "./config.js";

const uid = localStorage.getItem('uid');

export function confirmReceb(index, etapa) { //recebe um index, referente a posição do envio no array do banco de dados
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
            'Responsavel pelo recebimento': user
        };
        update(enviosRef, updates); //atualiza o banco de dados
    }
}

export function novoEnvio() {
    const confirmacao = confirm("Deseja salvar o envio?");
    if (confirmacao) {
        const malote = document.getElementById('malote').value;
        const responsavel = document.getElementById('responsavel').value;
        const destino = document.getElementById('destino').value;
        const transportador = document.getElementById('transportador').value;
        if (malote === '' || responsavel === '' || transportador === '') {
            alert("Preencha todos os campos.");
            return;
        }
        if (destino === 'Selecione') {
            alert("Selecione um destino válido.");
            return;
        }

        const data = new Date();
        const envio = {
            origem: {
                'Codigo do Malote': malote,
                Origem: user,
                Responsavel: responsavel,
                Saida: data,
                Destino: destino,
                Transportador: transportador
            },
            cd: {
                Chegada: '',
                'Responsavel pelo recebimento': '',
                Saida: '',
                'Responsavel pela saida': '',
                Transportador: ''
            },
            destino: {
                Chegada: '',
                'Responsavel pelo recebimento': '',
            }
        };

        const enviosRef = ref(database, `envios/`);
        update(enviosRef, { [window.dbLength]: envio }); //ele está sobreescrevendo o envio anterior, não adicionando um novo
        var myModalEl = document.getElementById('exampleModal');
        var modal = bootstrap.Modal.getInstance(myModalEl); 
        modal.hide();
    }
}