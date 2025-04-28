// Load players from localStorage on page load
let players = JSON.parse(localStorage.getItem('players')) || [];

// Handle adding a player
document.getElementById('addPlayerButton').addEventListener('click', () => {
  const playerName = document.getElementById('playerName').value.trim();
  if (playerName) {
    players.push({ name: playerName, points: 0 });
    document.getElementById('playerName').value = ''; // Clear the input field after adding
    updatePlayerList();
  }
});

// Update player list dynamically
function updatePlayerList() {
  const playersList = document.getElementById('playersList');
  const selfDrawPlayer = document.getElementById('selfDrawPlayer');
  
  // Update the self-draw dropdown
  selfDrawPlayer.innerHTML = '';
  players.forEach((player, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = player.name;
    selfDrawPlayer.appendChild(option);
  });

  // Clear previous player cards
  playersList.innerHTML = '';

  players.forEach((player, index) => {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card');
    const totalValue = (player.points * parseFloat(document.getElementById('pointValue').value)).toFixed(2);
    playerCard.innerHTML = `
      <h3>${player.name}</h3>
      <p>Points: ${player.points}</p>
      <p>Total Value: $${totalValue}</p>
      <button onclick="removePlayer(${index})">Remove Player</button>
      <button onclick="addPoints(${index})">Add Points</button>
      <button onclick="removePoints(${index})">Remove Points</button>
      <button onclick="transferPoints('${player.name}')">Transfer Points</button>
    `;
    playersList.appendChild(playerCard);
  });

  // Update total points value dynamically
  const totalPointsValue = players.reduce((total, player) => total + player.points, 0);
  document.getElementById('totalPointsValue').innerText = `Total Points Value: $${(totalPointsValue * parseFloat(document.getElementById('pointValue').value)).toFixed(2)}`;

  // Save players' data to localStorage to persist across pages
  localStorage.setItem('players', JSON.stringify(players));
}

// Add points to a player
function addPoints(index) {
  const pointsToAdd = parseInt(prompt('Enter points to add:'));
  if (!isNaN(pointsToAdd) && pointsToAdd > 0) {
    players[index].points += pointsToAdd;
    updatePlayerList();
  }
}

// Remove points from a player (Allow negative values)
function removePoints(index) {
  const pointsToRemove = parseInt(prompt('Enter points to remove:'));
  if (!isNaN(pointsToRemove) && pointsToRemove > 0) {
    players[index].points -= pointsToRemove; // Allow negative values (debt)
    updatePlayerList();
  }
}

// Transfer points to a winner (Allow negative points and calculate transfer correctly)
function transferPoints(playerName) {
  const pointsToTransfer = parseInt(prompt(`Enter the amount of points to transfer from ${playerName}:`));
  if (isNaN(pointsToTransfer) || pointsToTransfer <= 0) return; // No alerts, just ignore invalid inputs

  const recipientName = prompt('Enter the name of the player receiving the points:').trim();
  const recipient = players.find(player => player.name.toLowerCase() === recipientName.toLowerCase());

  if (recipient) {
    const playerIndex = players.findIndex(player => player.name.toLowerCase() === playerName.toLowerCase());
    if (players[playerIndex].points >= pointsToTransfer || true) { // Allow negative points
      players[playerIndex].points -= pointsToTransfer; // Subtract from the transferring player
      recipient.points += pointsToTransfer; // Add to the recipient (winner)
      updatePlayerList();
    }
  }
}

// Remove a player
function removePlayer(index) {
  players.splice(index, 1);
  updatePlayerList();
}

// Self-draw handling (Ask for the owed points amount)
document.getElementById('selfDrawButton').addEventListener('click', () => {
  const selfDrawIndex = parseInt(document.getElementById('selfDrawPlayer').value);
  if (selfDrawIndex >= 0 && selfDrawIndex < players.length) {
    const pointsOwed = parseInt(prompt('Enter the number of points owed by all other players:'));
    if (!isNaN(pointsOwed) && pointsOwed > 0) {
      players[selfDrawIndex].points += pointsOwed * (players.length - 1); // Winning player gets the total points from others
      players.forEach((player, index) => {
        if (index !== selfDrawIndex) {
          player.points -= pointsOwed; // Other players lose points, even into the negative (debt)
        }
      });
      updatePlayerList();
    } else {
      alert('Please enter a valid number of points.');
    }
  } else {
    alert("Invalid self-draw player selection.");
  }
});

// Load the players' data when switching pages
window.addEventListener('load', () => {
  updatePlayerList();
});
