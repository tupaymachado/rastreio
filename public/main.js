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

document.getElementById('statusQt').addEventListener('change', loadRecebimentos);
document.getElementById('enviosQt').addEventListener('change', loadEnvios);

function loadUser() { 
    return new Promise((resolve, reject) => {
        const userRef = ref(database, `users/${uid}`); 
        onValue(userRef, (snapshot) => { //
            const data = snapshot.val();
            console.log(data)
            window.user = data;
            resolve(data); //
            const nome = document.getElementById('user-logo');
            nome.innerHTML = `/ Bem-vindo, ${user}`;            
            loadDB(); //após o login, chama a função que carrega os dados do banco de dados
        }, (error) => {
            reject(error);
        });
    }
    )
};
loadUser();

function loadDB() {
    return new Promise((resolve, reject) => { 
        const enviosRef = ref(database, "envios");
        onValue(enviosRef, (snapshot) => { 
            const data = snapshot.val();
            window.envios = data;
            resolve(data);
            loadEnvios(); //carrega a tabela de malotes enviados
            loadRecebimentos(); //carrega a tabela de envios vindo para a loja e seu "status"
        }, (error) => {
            reject(error);
        });
    });
};

function createTableRows(data, tabela, isRecebimento) {
    tabela.innerHTML = '';
    const rows = [];
    for (let i = 0; i < data.length; i++) {
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
            <td>${data[i].origem['Codigo do Malote']}</td>
            <td>${data[i].origem['Origem']}</td>
            <td>${data[i].origem['Responsavel']}</td>
            <td>${data[i].origem['Saida']}</td>
            <td>${data[i].origem['Destino']}</td>
            <td>${data[i].origem['Transportador']}</td>
            <td>${data[i].cd['Chegada']}</td>
            <td>${data[i].cd['Responsavel pelo recebimento']}</td>
            <td>${data[i].cd['Saida']}</td>
            <td>${data[i].cd['Responsavel pela saida']}</td>
            <td>${data[i].cd['Transportador']}</td>
            ${isRecebimento ? createStatusColumn(data[i]) : ''}
        `;
        rows.push(novaLinha);
    }
    rows.forEach(row => {
        tabela.appendChild(row);
    });
}

function createStatusColumn(envio) {
    let envioStatus = '';
    if (!envio.destino['Chegada'] && !envio.cd['Responsavel pela saida']) {
        envioStatus = `<td>Em trânsito</td>`;
    } else if (!envio.destino['Chegada']) {
        envioStatus = `<td><button class='btn btn-primary btn-sm' onClick='confirmReceb(${envio.index})'>Recebido?</button></td>`;
    } else {
        envioStatus = `<td>Recebido</td>`;
    }
    return envioStatus;
}

function loadRecebimentos() {
    const tabelaStatus = document.getElementById("status-table-body");
    const statusMain = [];

    for (let i = 0; i < window.envios.length; i++) {
        if (window.envios[i].origem.Destino.toLowerCase() == user.toLowerCase()) {
            const envio = { ...window.envios[i], index: i };
            statusMain.push(envio);
        }
    }

    const statusQt = (document.getElementById("statusQt").value > statusMain.length) ? statusMain.length : document.getElementById("statusQt").value;

    const rows = statusMain.slice(-statusQt);
    createTableRows(rows, tabelaStatus, true);
}

function loadEnvios() {
    const tabelaEnvios = document.getElementById("envios-table-body");
    const enviosMain = [];

    for (let i = 0; i < window.envios.length; i++) {
        if (window.envios[i].origem.Origem.toLowerCase() == user.toLowerCase()) {
            enviosMain.push(window.envios[i]);
        }
    }

    const enviosQt = (document.getElementById("enviosQt").value > enviosMain.length) ? enviosMain.length : document.getElementById("enviosQt").value;

    const rows = enviosMain.slice(-enviosQt);
    createTableRows(rows, tabelaEnvios, false);
}


window.confirmReceb = function confirmReceb(index) {
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
        loadDB();
    }
}

document.getElementById('envioBtn').addEventListener('click', novoEnvio)

function novoEnvio() {
    const confirmacao = confirm("Deseja salvar o envio?");
    if (confirmacao) { 
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
        loadDB();
    }
}