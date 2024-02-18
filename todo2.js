document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('aufgabeHinzufuegenButton').addEventListener('click', aufgabeHinzufuegenApi);
    document.getElementById('aufgabenLadenButton').addEventListener('click', aufgabenLadenApi);
});

async function aufgabenLadenApi() {
    // Implementierung bleibt gleich, aber stelle sicher, dass du auf die richtige Liste referenzierst:
    const aufgabenListe = document.getElementById('apiTodoListe');
    // Der Rest deiner Funktion bleibt gleich.
}
    try {
        let userId = document.getElementById('userIdInput').value;
        let todoId = document.getElementById('todoIdInput').value;
        if ( userId === '') {
            alert('Bitte eine Aufgabe eingeben!');
            return;
        }
        let apiUrl = `https://lfktzszvp3.execute-api.eu-central-1.amazonaws.com/default/get_item?UserID=${userId}`;

        if (todoId) {
            apiUrl += `&TodoID=${todoId}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aufgabenListe = document.getElementById('todoListe');
        aufgabenListe.innerHTML = ''; // Leert die aktuelle Liste, um sie neu zu befüllen

        if (data.Tasks && data.Tasks.length > 0) {
            data.Tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `TodoID: ${task.TodoID}, Task: ${task.Task}`; // Zeige TodoID und Task an

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Löschen';
                deleteButton.onclick = function() {
                    aufgabeLoeschen(userId, task.TodoID);
                };
                li.appendChild(deleteButton);

                aufgabenListe.appendChild(li);
            });
        } else {
            alert('Es wurden keine Aufgaben gefunden.');
        }
    } catch (error) {
        console.error('Fehler beim Laden der Aufgaben:', error);
    }
async function aufgabeLoeschen(userId, todoId) {
    try {
        console.log('Aufgabe wird gelöscht:', todoId);

        const endpoint = 'https://lfktzszvp3.execute-api.eu-central-1.amazonaws.com/default/delete_item';

        const requestBody = {
            UserID: userId,
            TodoID: todoId
        };

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Deleted record:', data);
        aufgabenLaden();

        return data;
    } catch (error) {
        console.error('Error deleting records:', error.message);
        throw error;
    }
}
async function aufgabeHinzufuegen() {
    try {
        let userId = document.getElementById('userIdInput').value;
        let taskDescription = document.getElementById('taskInput').value;

        if (taskDescription === '') {
            alert('Bitte eine Task eingeben!');
            return;
        }

        const requestBody = {
            UserID: userId,
            Task: taskDescription
        };

        const response = await fetch('https://lfktzszvp3.execute-api.eu-central-1.amazonaws.com/default/put_item' + userId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log(response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);//Response.
        }
        const data = await response.json();
        console.log('Added record:', data);
        aufgabenLaden();

        return data;
    } catch (error) {
        console.error('Error adding record:', error.message);
        throw error;
    }
}