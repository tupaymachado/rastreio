import { set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { createTableRows, createTableRowsCD } from "./createTable.js";
import { database, ref, onValue } from "./config.js";

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
            loadDB(isCD);
        }, (error) => {
            reject(error);
        });
    }
    )
};

export function loadDB(isCD) { //refazer objetos do /envios
    return new Promise((resolve, reject) => {
        const enviosRef = ref(database, "envios");
        onValue(enviosRef, (snapshot) => {
            const data = snapshot.val();
            window.envios = data/* .filter(Boolean); */
            resolve(data);
            if (isCD) {
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
    const statusQt = (document.getElementById("statusQt").value > statusMain.length) ? statusMain.length : document.getElementById("statusQt").value; //confere se o valor do input é maior que o tamanho do array
    const rows = statusMain.slice(-statusQt);
    if (isCD) {
        createTableRowsCD(rows)
    } else {
        createTableRows(rows, tabelaStatus, true);
    }
}

export function loadEnvios() { //Erro quando acessa um item vazio do index de window.envios
    if (user == 'Pelotas - Laranjal') {
        limpaDB();
    }
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

export function limpaDB() {
    const dataAtual = new Date();
    for (let i = 0; i < window.envios.length; i++) {
        if (!window.envios[i]?.destino?.Chegada) {
            console.log(i + " Não tem data de chegada")
            continue;
        } else {
            let dataRecebimento = new Date(window.envios[i].destino.Chegada);
            const diferencaMilissegundos = dataAtual - dataRecebimento;
            const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
            if (diferencaDias > 30) {
                const itemRef = ref(database, `envios/${i}`);
                set(itemRef, null)
                    .then(() => {
                        console.log(i + " Item excluído com sucesso!");
                    })
                    .catch((error) => {
                        console.error("Erro ao excluir o item:", error);
                    });
            }
        }
    }
}
