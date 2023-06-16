import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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

document.getElementById('enviosQt').addEventListener('change', function() {
    const quantidade = parseInt(this.value);
    loadStatus(quantidade);
  });

function loadEnvios() {
    return new Promise((resolve, reject) => {
        const enviosRef = ref(database, "envios");

        onValue(enviosRef, (snapshot) => {
            const data = snapshot.val();
            window.envios = data;
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
};
loadEnvios()

function loadUser() {
    return new Promise((resolve, reject) => {
        console.log(uid)
        const userRef = ref(database, `users/${uid}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            window.user = data;
            resolve(data);
            const nome = document.getElementById('user-logo');
            nome.innerHTML = `/ Bem-vindo, ${user}`;
            loadStatus();
        }, (error) => {
            reject(error);
        });
    }
    )
};
loadUser()

function loadStatus() {
    console.log('loadStatus')
    const tabelaOrigem = document.getElementById("tabela-origem").getElementsByTagName("tbody")[0];
    const tabelaCD = document.getElementById("tabela-cd").getElementsByTagName("tbody")[0];
    const tabelaRecebido = document.getElementById("tabela-recebido").getElementsByTagName("tbody")[0];
    tabelaCD.innerHTML = '';
    tabelaOrigem.innerHTML = '';
    tabelaRecebido.innerHTML = '';
    const enviosQt = document.getElementById("enviosQt").value;
    for (let i = window.envios.length - enviosQt; i < window.envios.length; i++) {
        if (window.envios[i].origem.Destino.toLowerCase() == user.toLowerCase()) { //jogar os envios selecionados para um outro array e fazer ele aparecer dali
            console.log(i)
            const novaLinhaOrigem = document.createElement("tr");
            novaLinhaOrigem.innerHTML = `
                <td>${window.envios[i].origem['Codigo do Malote']}</td>
                <td>${window.envios[i].origem['Origem']}</td>
                <td>${window.envios[i].origem['Responsavel']}</td>
                <td>${window.envios[i].origem['Saida']}</td>
                <td>${window.envios[i].origem['Destino']}</td>
                <td>${window.envios[i].origem['Transportador']}</td>
            `;
            tabelaOrigem.appendChild(novaLinhaOrigem); //adiciona a linha na tabela de origem
            const novaLinhaCD = document.createElement("tr");
            novaLinhaCD.innerHTML = `
                <td>${window.envios[i].cd['Chegada']}</td>
                <td>${window.envios[i].cd['Responsavel pelo recebimento']}</td>
                <td>${window.envios[i].cd['Saida']}</td>
                <td>${window.envios[i].cd['Responsavel pela saida']}</td>
                <td>${window.envios[i].cd['Transportador']}</td>
            `;
            tabelaCD.appendChild(novaLinhaCD);
            const novaLinhaRecebido = document.createElement("tr");
            if (!window.envios[i].destino['Chegada'] && !window.envios[i].cd['Responsavel pela saida']) {
                novaLinhaRecebido.innerHTML = `<td>Em trânsito</td>`;
                tabelaRecebido.appendChild(novaLinhaRecebido);
            } else if (!window.envios[i].destino['Chegada']) {
                novaLinhaRecebido.innerHTML = `<td><input type='checkbox'>Recebido?</input></td>`; //inserir função que muda o status para recebido
                tabelaRecebido.appendChild(novaLinhaRecebido);
            } else {
                novaLinhaRecebido.innerHTML = `<td>Recebido</td>`;
                tabelaRecebido.appendChild(novaLinhaRecebido);
            }
        }
    }
}