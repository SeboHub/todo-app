document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('hinzufuegenButton').addEventListener('click', neueAufgabeHinzufuegen);

    // Event Listener für das Eingabefeld, um auf die Enter-Taste zu reagieren
    document.getElementById('neueAufgabe').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            neueAufgabeHinzufuegen();
        }
    });

    // Event Listener für den "Daten abrufen"-Button
    document.getElementById('fetchData').addEventListener('click', datenAbrufen);

    aufgabenLaden();
});

function aufgabenLaden() {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || [];
    let aufgabenListe = document.getElementById('todoListe');
    aufgabenListe.innerHTML = '';

    aufgaben.forEach((aufgabe, index) => {
        let li = document.createElement('li');
        let textSpan = document.createElement('span');
        textSpan.textContent = aufgabe.text;

        let zeitstempelSpan = document.createElement('span');
        zeitstempelSpan.className = 'zeitstempel';
        zeitstempelSpan.textContent = formatiereZeitstempel(aufgabe.zeit);

        let loeschButton = document.createElement('button');
        loeschButton.textContent = 'Löschen';
        loeschButton.addEventListener('click', function() {
            aufgabeLoeschen(index);
        });

        li.appendChild(textSpan);
        li.appendChild(zeitstempelSpan);
        li.appendChild(loeschButton);
        aufgabenListe.appendChild(li);
    });
}

function aufgabeLoeschen(index) {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || [];
    aufgaben.splice(index, 1);
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben));
    aufgabenLaden();
}

function neueAufgabeHinzufuegen() {
    let aufgabeInput = document.getElementById('neueAufgabe');
    let aufgabeText = aufgabeInput.value.trim();
    if (!aufgabeText) {
        alert('Bitte eine Aufgabe eingeben!');
        return;
    }
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || [];
    aufgaben.push({ text: aufgabeText, zeit: new Date().toISOString() });
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben));
    aufgabeInput.value = '';
    aufgabenLaden();
}

function formatiereZeitstempel(isoString) {
    let datum = new Date(isoString);
    let stunden = datum.getHours().toString().padStart(2, '0');
    let minuten = datum.getMinutes().toString().padStart(2, '0');
    let tag = datum.getDate().toString().padStart(2, '0');
    let monat = (datum.getMonth() + 1).toString().padStart(2, '0');
    let jahr = datum.getFullYear().toString().slice(2);
    return `${stunden}:${minuten} - ${tag}.${monat}.${jahr}`;
}