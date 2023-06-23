import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { createTableRows, createTableRowsCD } from "./createTable.js";
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

export function loadUser() { //carrega o usuário, confere se é do CD e chama loadDB, passando o parâmetro isCD
    return new Promise((resolve, reject) => {
        const userRef = ref(database, `users/${uid}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            window.user = data;
            resolve(data);
            const nome = document.getElementById('user-logo');
            nome.innerHTML = `/ Bem-vindo, ${user}`;
            const isCD = (user == 'CD') ? true : false;
            console.log('loadUser rodou');
            loadDB(isCD);
        }, (error) => {
            reject(error);
        });
    }
    )
};

export function loadDB(isCD) { //carrega o banco de dados e chama loadEnvios e loadRecebimentos
    return new Promise((resolve, reject) => {
        const enviosRef = ref(database, "envios");
        onValue(enviosRef, (snapshot) => {
            const data = snapshot.val();
            window.envios = data;
            resolve(data);
            if (isCD) {
                console.log('loadDB rodou certo');
                loadRecebimentos(isCD);
            } else {
                loadEnvios();
                loadRecebimentos(isCD)
            }
        },
            (error) => {
                reject(error);
            });
    });
};

export function loadRecebimentos(isCD) { //carrega recebimentos no main normal e carrega TUDO no mainCD
    const tabelaStatus = document.getElementById("status-table-body");
    const statusMain = [];
    if (isCD) {//se for CD, carrega todos os envios
        for (let i = 0; i < window.envios.length; i++) {
            const envio = { ...window.envios[i], index: i };
            statusMain.push(envio);
        }
    } else {
        for (let i = 0; i < window.envios.length; i++) {
            if (window.envios[i].origem.Destino.toLowerCase() == user.toLowerCase()) {
                const envio = { ...window.envios[i], index: i };
                statusMain.push(envio);
            }
        }
    }
    const statusQt = (document.getElementById("statusQt").value > statusMain.length) ? statusMain.length : document.getElementById("statusQt").value;
    const rows = statusMain.slice(-statusQt);
    if (isCD) {
        createTableRowsCD(rows)
    } else {
        createTableRows(rows, tabelaStatus, true);
    }
}
export function loadEnvios() {
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