import { set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { createTableRows, createTableRowsCD } from "./createTable.js";
import { database, ref, onValue, update } from "./config.js";

const uid = localStorage.getItem('uid');

export function loadUser() { //carrega o usuário, confere se é do CD e chama loadDB, passando o parâmetro isCD
    return new Promise((resolve, reject) => {
        const userRef = ref(database, `users/${uid}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            window.user = data;
            resolve(data);
            const nome = document.getElementById('user-logo');
            nome.innerHTML = `Você está logado em: ${user}`;
            if (user == 'Matriz') {
                const elements = document.getElementsByClassName("hide");
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'inline';
                }
            }
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
    if (user == 'Matriz') { //atualizar quando mudar o nome do usuário Matriz
        const origemTabela = document.getElementById("origemTabela").value;
        console.log(origemTabela)
        const status = document.getElementById("status").value;
        console.log(status)
        if (origemTabela != 'todos') {
            for (let i = 0; i < statusMain.length; i++) {
                if (statusMain[i].origem.Origem != origemTabela) {
                    statusMain.splice(i, 1);
                    i--;
                }
            }
        }
        if (status != 'todos') {
            if (status == 'recebidos') {
                for (let i = 0; i < statusMain.length; i++) {
                    if (statusMain[i].destino.Chegada == '') {
                        statusMain.splice(i, 1);
                        i--;
                    }
                }
            } else {
                for (let i = 0; i < statusMain.length; i++) {
                    if (statusMain[i].destino.Chegada != '') {
                        statusMain.splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }
    console.log(statusMain)
    const quant = (document.getElementById("quant").value > statusMain.length) ? statusMain.length : document.getElementById("quant").value; //confere se o valor do input é maior que o tamanho do array
    const rows = statusMain.slice(-quant);
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
        console.log(i)
        if (window.envios[i].origem.Origem.toLowerCase() == user.toLowerCase()) {
            enviosMain.push(window.envios[i]);
        }
    }
    //adicionar filtro de status de entrega e destino
    const enviosQt = (document.getElementById("enviosQt").value > enviosMain.length) ? enviosMain.length : document.getElementById("enviosQt").value;
    const rows = enviosMain.slice(-enviosQt);
    createTableRows(rows, tabelaEnvios, false);
}

export function limpaDB() { //puta que pariu, que gambiarra complexa
    return new Promise((resolve, reject) => {
        const userRef = ref(database, `users/ultimaLimpeza`);
        get(userRef) //verifica a data da última limpeza
            .then((snapshot) => {
                const data = snapshot.val()
                const dataAtual = new Date();
                const ultimaLimpeza = new Date(data);
                console.log('última limpeza: ' + ultimaLimpeza)
                const diferencaMilissegundos = dataAtual - ultimaLimpeza;
                const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
                if (diferencaDias > 30) {
                    console.log(diferencaDias)
                    update(userRef, dataAtual) //
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