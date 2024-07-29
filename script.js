let clubes = {};

function addTech() {
    const techName = document.getElementById('techName').value;
    const clubName = document.getElementById('clubName').value;

    if (!techName || !clubName) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (clubes[clubName]) {
        alert('Já existe um clube com esse nome.');
        return;
    }

    clubes[clubName] = {
        tecnico: techName,
        jogadores: []
    };

    const clubSelect = document.getElementById('clubSelect');
    const option = document.createElement('option');
    option.value = clubName;
    option.text = clubName;
    clubSelect.add(option);

    document.getElementById('techName').value = '';
    document.getElementById('clubName').value = '';

    alert(`Técnico ${techName} e clube ${clubName} adicionados com sucesso.`);
}

function addPlayer() {
    const clubName = document.getElementById('clubSelect').value;
    const playerName = document.getElementById('playerName').value;
    const playerNumber = document.getElementById('playerNumber').value;
    const playerPosition = document.getElementById('playerPosition').value;
    const favoritePlayer = document.getElementById('favoritePlayer').checked;

    if (!clubName || !playerName || !playerNumber || !playerPosition) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (clubes[clubName].jogadores.length >= 23) {
        alert('Cada clube pode ter no máximo 23 jogadores.');
        return;
    }

    clubes[clubName].jogadores.push({
        nome: playerName,
        numero: playerNumber,
        posicao: playerPosition,
        favorito: favoritePlayer
    });

    document.getElementById('playerName').value = '';
    document.getElementById('playerNumber').value = '';
    document.getElementById('playerPosition').value = '';
    document.getElementById('favoritePlayer').checked = false;

    alert(`Jogador ${playerName} adicionado ao clube ${clubName} com sucesso.`);
}

function viewClubs() {
    const clubList = document.getElementById('clubList');
    clubList.innerHTML = '<h2>Lista de Clubes</h2>';

    for (const [clubName, clubInfo] of Object.entries(clubes)) {
        const clubDiv = document.createElement('div');
        clubDiv.classList.add('club');
        clubDiv.innerHTML = `<h3>Clube: ${clubName} (Técnico: ${clubInfo.tecnico})</h3>`;

        clubInfo.jogadores.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');
            playerDiv.innerHTML = `Jogador: ${player.nome} - Camisa: ${player.numero} - Posição: ${player.posicao} ${player.favorito ? '<span class="favorite">★</span>' : ''}`;
            clubDiv.appendChild(playerDiv);
        });

        clubList.appendChild(clubDiv);
    }

    clubList.style.display = 'block';
}

function getStarImageBase64() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAAD8GO2jAAAAA3NCSVQICAjb4U/gAAAAAElEQVR42mJ0Pj4AAwAB/FBJzjAAAAAElFTkSuQmCC';
}

function savePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const starImage = getStarImageBase64();

    let y = 10;

    doc.setFontSize(18);
    doc.text('Clubes de Futebol', 10, y);
    y += 10;

    for (const [clubName, clubInfo] of Object.entries(clubes)) {
        doc.setFontSize(16);
        doc.text(`Clube: ${clubName} (Técnico: ${clubInfo.tecnico})`, 10, y);
        y += 10;

        doc.setFontSize(14);
        clubInfo.jogadores.forEach(player => {
            doc.text(`Jogador: ${player.nome} - Camisa: ${player.numero} - Posição: ${player.posicao}`, 10, y);
            if (player.favorito) {
                try {
                    doc.addImage(starImage, 'PNG', 150, y - 5, 10, 10);
                } catch (error) {
                    console.error('Erro ao adicionar imagem: ', error);
                }
            }
            y += 10;

            if (y > 280) {
                doc.addPage();
                y = 10;
            }
        });

        y += 10;
        if (y > 280) {
            doc.addPage();
            y = 10;
        }
    }

    doc.save('clubes_de_futebol.pdf');
}

