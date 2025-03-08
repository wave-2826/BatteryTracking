const form = document.querySelector('form');
const storage = window.localStorage;
let batteries = [];
if(storage.getItem('batteries')){
    batteries = JSON.parse(storage.getItem('batteries'));
}
form.addEventListener("submit", function(event){
    event.preventDefault();
    let battery = {};
    data = new FormData(form);
    for (const [key, value] of data.entries()) {
        battery[key] = value;
    }
    batteries.push(battery);
    storage.setItem('batteries', JSON.stringify(batteries));
    form.reset();
    console.log(batteries);
    displayData();
})
function displayData(){
    const display = document.querySelector('#battery-data-display');
    display.innerHTML = '';
    batteries.forEach(battery => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>Battery ID: ${battery.Batteryid}</p>
            <p>Date: ${battery.date}</p>
            <p>In/Out: ${battery['in-out']}</p>
            <p>Status: ${battery.status}</p>
            <p>Charge Level: ${battery.chargelevel}</p>
            <p>V0: ${battery.v0} @ 0 Amps</p>
            <p>V1: ${battery.v1} @ 1 Amp</p>
            <p>V2: ${battery.v2} @ 18 Amps</p>
            <p>Rint: ${battery.rint} Ohms</p>
            <hr>
        `;
        display.appendChild(div);
    })
}

displayData();

function jsonToCsv(jsonData) {
    let csv = '';

    // Extract headers
    const headers = Object.keys(jsonData[0]);
    csv += headers.join(',') + '\n';

    // Extract values
    jsonData.forEach(obj => {
        const values = headers.map(header => obj[header]);
        csv += values.join(',') + '\n';
    });

    return csv;
}

document.getElementById('download-csv').addEventListener('click', function() {
    if (batteries.length === 0) {
        alert('No data to download');
        return;
    }
    const csv = jsonToCsv(batteries);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batteries.csv';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
});
document.getElementById('download-json').addEventListener('click', function() {
    if (batteries.length === 0) {
        alert('No data to download');
        return;
    }
    const json = JSON.stringify(batteries, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batteries.json';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
});

document.getElementById('import-json').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const jsonData = JSON.parse(e.target.result);
            batteries = jsonData;
            storage.setItem('batteries', JSON.stringify(batteries));
            displayData();
        };
        reader.readAsText(file);
    }
});

document.getElementById('clear-data').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all data?')) {
        batteries = [];
        storage.removeItem('batteries');
        displayData();
    }
});

document.getElementById('date').valueAsDate = new Date();
document.getElementById('fill-130').addEventListener('click', function() {
    document.getElementById('chargelevel').value = 130;
});