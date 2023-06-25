export function createTableRows(data, tabela, isRecebimento) {
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
            ${isRecebimento ? createStatusColumn(true, data[i]) : createStatusColumn(false, data[i])}
        `;
        rows.push(novaLinha);
    }
    rows.forEach(row => {
        tabela.appendChild(row);
    });
}

export function createStatusColumn(isRecebimento, envio) {
    let envioStatus = '';
    if (isRecebimento) {
        if (!envio.cd['Responsavel pela saida']) {
            envioStatus = `<td>Em trânsito</td>`;
        } else if (!envio.destino['Chegada']) {
            envioStatus = `<td><button class='btn btn-primary btn-sm' onClick='confirmReceb(${envio.index})'>Recebido?</button></td>`;
        } else {
            envioStatus = `<td>Recebido</td>`;
        }
    } else {
        envioStatus =
            `<td>${envio.destino['Chegada']}</td>
            <td>${envio.destino['Responsavel pelo recebimento']}</td>`;
    }
    return envioStatus;
}

export function createTableRowsCD(data) {
    const tabela = document.getElementById("cd-table-body");
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
            ${createStatusColumnCD(data[i])}
            <td>${data[i].destino['Chegada']}</td>
            <td>${data[i].destino['Responsavel pelo recebimento']}</td>
            `
            ;
        rows.push(novaLinha);
    }
    rows.forEach(row => {
        tabela.appendChild(row);
    });
}

export function createStatusColumnCD(envio) {
    let cells = '';
    if (!envio.cd['Chegada'] && !envio.cd['Responsavel pelo recebimento']) {
        cells = `
            <td><button class='btn btn-primary btn-sm' onClick="confirmCD(${envio.index}, 'chegada')">Confirmar recebimento</button></td>
            <td><input type='text' id='respChegada${envio.index}' placeholder='Responsável Receb.'></input></td>
            <td>CONFIRME A CHEGADA</td>
            <td>CONFIRME A CHEGADA</td>
            <td>CONFIRME A CHEGADA</td>
            `;
    } else if (envio.cd['Chegada'] && !envio.cd['Responsavel pela saida']) {
        cells = `
            <td>${envio.cd['Chegada']}</td>
            <td>${envio.cd['Responsavel pelo recebimento']}</td>
            <td><button class='btn btn-primary btn-sm' onClick="confirmCD(${envio.index}, 'saida')">Confirmar saida</button></td>
            <td><input type='text' id='respSaida${envio.index}' placeholder='Responsável Saída'></input></td>
            <td><input type='text' id='transportador${envio.index}' placeholder='Transportador'></input></td>
        `;
    } else {
        cells = `
            <td>${envio.cd['Chegada']}</td>
            <td>${envio.cd['Responsavel pelo recebimento']}</td>
            <td>${envio.cd['Saida']}</td>
            <td>${envio.cd['Responsavel pela saida']}</td>
            <td>${envio.cd['Transportador']}</td>
        `;
    }
    return cells;
}