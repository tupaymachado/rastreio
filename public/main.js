import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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

document.getElementById('statusQt').addEventListener('change', function () {
    loadStatus();
});

document.getElementById('enviosQt').addEventListener('change', function () {
    loadEnvios();
});

function loadEnviosDB() {
    return new Promise((resolve, reject) => {
        const enviosRef = ref(database, "envios");

        onValue(enviosRef, (snapshot) => {
            const data = snapshot.val();
            window.envios = data;
            resolve(data);
            loadEnvios();
            loadStatus();
        }, (error) => {
            reject(error);
        });
    });
};

function loadUser() {
    return new Promise((resolve, reject) => {
        const userRef = ref(database, `users/${uid}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            window.user = data;
            resolve(data);
            const nome = document.getElementById('user-logo');
            nome.innerHTML = `/ Bem-vindo, ${user}`;
            loadEnviosDB();
        }, (error) => {
            reject(error);
        });
    }
    )
};
loadUser();

function loadStatus() { //função que carrega a tabela de status
    const tabelaStatus = document.getElementById("status-table-body");
    tabelaStatus.innerHTML = '';
    const statusMain = [];
    for (let i = 0; i < window.envios.length; i++) {
        if (window.envios[i].origem.Destino.toLowerCase() == user.toLowerCase() && window.envios[i].cd['Saida'] != '') {
            const envio = { ...window.envios[i], index: i };
            statusMain.push(envio);
        }
    }
    const statusQt = (document.getElementById("statusQt").value > statusMain.length) ? statusMain.length : document.getElementById("statusQt").value;
    for (let j = statusMain.length - statusQt; j < statusMain.length; j++) {
        let envioStatus = '';
        if (!statusMain[j].destino['Chegada'] && !statusMain[j].cd['Responsavel pela saida']) {
            envioStatus = `<td>Em trânsito</td>`;
        } else if (!statusMain[j].destino['Chegada']) {
            envioStatus = `<td><button class='btn btn-primary btn-sm' onClick='confirmReceb(${statusMain[j].index})'>Recebido?</button></td>`; //inserir função que muda o status para recebido

        } else {
            envioStatus = `<td>Recebido</td>`;
        }
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
                <td>${statusMain[j].origem['Codigo do Malote']}</td>
                <td>${statusMain[j].origem['Origem']}</td>
                <td>${statusMain[j].origem['Responsavel']}</td>
                <td>${statusMain[j].origem['Saida']}</td>
                <td>${statusMain[j].origem['Destino']}</td>
                <td>${statusMain[j].origem['Transportador']}</td>
                <td>${statusMain[j].cd['Chegada']}</td>
                <td>${statusMain[j].cd['Responsavel pelo recebimento']}</td>
                <td>${statusMain[j].cd['Saida']}</td>
                <td>${statusMain[j].cd['Responsavel pela saida']}</td>
                <td>${statusMain[j].cd['Transportador']}</td>
                ${envioStatus}
            `;
        tabelaStatus.appendChild(novaLinha);
    }
};

function loadEnvios() { //função que carrega a tabela de envios
    const tabelaEnvios = document.getElementById("envios-table-body");
    tabelaEnvios.innerHTML = '';
    const enviosMain = [];
    for (let i = 0; i < window.envios.length; i++) {
        if (window.envios[i].origem.Origem.toLowerCase() == user.toLowerCase()) {
            enviosMain.push(window.envios[i])
        }
    }
    const enviosQt = (document.getElementById("enviosQt").value > enviosMain.length) ? enviosMain.length : document.getElementById("enviosQt").value;
    for (let j = enviosMain.length - enviosQt; j < enviosMain.length; j++) {
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
                <td>${enviosMain[j].origem['Codigo do Malote']}</td>
                <td>${enviosMain[j].origem['Origem']}</td>
                <td>${enviosMain[j].origem['Responsavel']}</td>
                <td>${enviosMain[j].origem['Saida']}</td>
                <td>${enviosMain[j].origem['Destino']}</td>
                <td>${enviosMain[j].origem['Transportador']}</td>
                <td>${enviosMain[j].cd['Chegada']}</td>
                <td>${enviosMain[j].cd['Responsavel pelo recebimento']}</td>
                <td>${enviosMain[j].cd['Saida']}</td>
                <td>${enviosMain[j].cd['Responsavel pela saida']}</td>
                <td>${enviosMain[j].cd['Transportador']}</td>
            `;
        tabelaEnvios.appendChild(novaLinha);
    }
};

window.confirmReceb = function confirmReceb(index) {
    const confirmacao = confirm("Deseja confirmar o recebimento?");
    console.log(index);
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
        loadEnviosDB();
    }
}

document.getElementById('envioBtn').addEventListener('click', novoEnvio)

function novoEnvio() {
    const confirmacao = confirm("Deseja salvar o envio?");
    if (!confirmacao) {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        const dataAtual = `${dia}/${mes}/${ano}`;
        const malote = document.getElementById('malote').value;
        const responsavel = document.getElementById('responsavel').value;
        const destino = document.getElementById('destino').value;
        const transportador = document.getElementById('transportador').value;
        const envio = {
            origem: {
                'Codigo do Malote': malote,
                Origem: user,
                Responsavel: responsavel,
                Saida: dataAtual,
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
        const enviosRef = ref(database, `envios/`);//referencia o banco de dados
        update(enviosRef, { [envios.length]: envio });//atualiza o banco de dados
        loadEnviosDB();
    }
}