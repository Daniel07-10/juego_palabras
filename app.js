document.addEventListener("DOMContentLoaded", () =>{

    const body = document.querySelector("body");
    const btnAddPlayer = document.querySelector(".add-player");
    const btnStartGame = document.querySelector(".start-game");
    const playerSlots = document.querySelectorAll(".player-slot");

    let players = []; //lista jugadores que ingresan
    let numPlayers = 0
    let currentPlayerIndex = 0;
    let playerScores = {};
    let usedWords = new Set();
    let gameContainer;

    btnAddPlayer.addEventListener('click', showPlayerForm);
    btnStartGame.addEventListener('click', starGame);

    
    function askTotalPlayers(){

        //Pedir al usuario cuantos jugadores van a participar

        numPlayers = parseInt(prompt("¿Cuantos jugadores van a jugar? (Minimo 2, Maximo 4)"));

        if(isNaN(numPlayers) || numPlayers < 2 || numPlayers > 4){
            alert("Debe ingresar un numero entre 2 y 4");
            return false;
        }
        return true;
    }

    function showPlayerForm(){

        if(!askTotalPlayers()) return;
        //crear formulario emergente

        let form = document.createElement("div");
        form.classList.add("form");
        form.innerHTML = `<h2>Agregar Jugadores</h2>`;

        let main = document.querySelector("main");
        let conditions =  document.getElementById("conditions")
     
        //crear un input para cada jugador
            
        for( let i = 1; i <= numPlayers; i++){
         form.innerHTML += `<input type="text" class="playerNameInput" placeholder="Nombre del Jugador ${i}">`;
        }
        
        form.innerHTML += ` 
        <button class="confirmPlayers" id="confirmPlayers">Confirmar</button>
        <button class="closeForm" id="closeForm">Cerrar</button>   
        `;
        
        form.style.opacity = "1";
        main.style.height="110vh"
        conditions.style.top="40%"
        body.appendChild(form);

        document.querySelector(".confirmPlayers").addEventListener("click",() => {
            const nameInputs = document.querySelectorAll(".playerNameInput");
            let newPlayers = [];

            //validar y agregar nombres
            for(let input of nameInputs){
                let playerName = input.value.trim();

                if(!playerName){
                    alert("Todos los nombres deben estar llenos.");
                    return;
                }

                if(newPlayers.includes(playerName) || players.includes(playerName)){
                    alert("No se pueden repetir nombres");
                    return;
                }
                
                newPlayers.push(playerName);
                playerScores[playerName] = 0;
            }

            //agregar los nombres a la lista principal
            players = newPlayers;

            //Mostrar nombres en los parrafos del HTML
            for(let i = 0; i < players.length; i++){
                playerSlots[i].textContent = "Jugador " + (i+1) + " : " + players[i];
                playerSlots[i].style.fontWeight = "bold";
            }

            //eliminar el formulario despues de confirmar
            body.removeChild(form);
            btnStartGame.style.display = "block";
        });

        //cerrar el formulario sin agregar jugadores
        
        document.querySelector(".closeForm").addEventListener("click", () => {
            body.removeChild(form);
        }); 
    }   
    function starGame (){
        body.innerHTML = `
        <div class = "game-container">
         <h2>Turno de: <span id = "current-player">${players[0]}</span></h2>
         <h3>Letra: <span id = "random-letter">${generateRandomLetter()}</span></h3>
         <h3>Tiempo Restante: <span id = "timer">60</span> segundos</h3>
         <input type = "text" class="word-input" id = "word-input" placeholder = "Escribe una palabra">
         <div id = "word-list"></div>
        </div>
        `;

        gameContainer = document.querySelector(".game-container");
        let wordInput = document.getElementById("word-input");
        wordInput.addEventListener("keypress", (event) => {
            if(event.key === "Enter"){
                submitWord(wordInput.value.trim());
                wordInput.value = "";
            }
        });
        startTurn();
    }

    function startTurn (){
        let timeLeft = 60;
        let timerElement = document.getElementById("timer");
        let interval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if(timeLeft <= 0){
                clearInterval(interval);
                nextPlayer();
            }
        },1000);
    }

    function nextPlayer(){
        currentPlayerIndex++;
        if(currentPlayerIndex < players.length){
            document.getElementById("current-player").textContent = players[currentPlayerIndex];
            document.getElementById("random-letter").textContent = generateRandomLetter();
            document.getElementById("word-list").innerHTML = "";
            startTurn();
        }else {
            showResults();
        }
    }

    function submitWord(word){
        let currentLetter = document.getElementById("random-letter").textContent.toLowerCase();
        let currentPlayer = players[currentPlayerIndex];

        if (!word.startsWith(currentLetter)) {
            alert("La palabra debe comenzar con la letra indicada.");
            return;
        }

        if (usedWords.has(word)) {
            alert("Esa palabra ya ha sido usada.");
            return;
        }

        usedWords.add(word);
        playerScores[currentPlayer] += 10;

        let wordList = document.getElementById("word-list");
        let wordItem = document.createElement("p");
        wordItem.textContent = word;
        wordList.appendChild(wordItem);
    }

    function generateRandomLetter(){
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    function showResults(){
        let sortedScores = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);

        body.innerHTML = `
            <div class="results-container">
                <h2>¡Juego terminado!</h2>
                <h3>Ganador: <span>${sortedScores[0][0]}</span> con ${sortedScores[0][1]} puntos</h3>
                <table>
                    <tr><th>Posición</th><th>Jugador</th><th>Puntos</th><th>Diferencia</th></tr>
                    ${sortedScores.map((player, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${player[0]}</td>
                            <td>${player[1]}</td>
                            <td>${index === 0 ? '-' : sortedScores[0][1] - player[1]}</td>
                        </tr>
                    `).join("")}
                </table>
                <button class="btn-playAgain" onclick="location.reload()">Jugar de nuevo</button>
            </div>
        `;
    }
});