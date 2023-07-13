import { set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
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
            window.envios = data ? data.filter(Boolean) : []; //.filter(Boolean) filtra os índices vazios do vetor, e facilita o trabalho; em caso do DB ficar sem nenhum item, é preciso definir essa variálvel como um array vazio
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
    if (isCD) { //se for CD, carrega todos os envios
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

export function loadEnvios() {
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

export function limpaDB() { //puta que pariu, que gambiarra complexa
    return new Promise((resolve, reject) => {
        const userRef = ref(database, `users/ultimaLimpeza`);
        get(userRef) //verifica a data da última limpeza
            .then((snapshot) => {
                const data = snapshot.val();
                console.log(data)
                const dataAtual = new Date();
                const ultimaLimpeza = new Date(data);
                console.log(ultimaLimpeza)
                const diferencaMilissegundos = dataAtual - ultimaLimpeza;
                const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
                console.log(diferencaDias)
                //limpa o database
                if (diferencaDias > 30) {
                    update(userRef, dataAtual)
                        .then(() => {
                            console.log("Data atualizada com sucesso!");
                        })
                        .catch((error) => {
                            console.error("Erro ao atualizar o database:", error);
                        });
                    for (let i = 0; i < window.envios.length; i++) {
                        if (!window.envios[i]?.destino?.Chegada) { //
                            continue;
                        } else {
                            let dataRecebimento = new Date(window.envios[i].destino.Chegada);
                            const diferencaMilissegundos = dataAtual - dataRecebimento;
                            const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
                            if (diferencaDias > 30) {
                                console.log('Teste ' + diferencaDias);
                                window.envios.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    const enviosRef = ref(database, "envios");
                    set(enviosRef, window.envios)
                        .then(() => {
                            console.log("Database atualizado da sucesso!");
                        })
                        .catch((error) => {
                            console.error("Erro ao atualizar o database:", error);
                        });
                }
            })
    })
}