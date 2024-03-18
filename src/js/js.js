let mapCount = 0;
let displayedEvents = 0;
let eventsPerPage = 10;
let visaMerEl = document.getElementById("visa-mer-data")
visaMerEl.addEventListener("click", displayMoreEvents);


async function getData() {
    try {
        let response = await fetch("https://polisen.se/api/events");
        let data = await response.json();
        displayData(data);
    } catch (error) {
        console.log('Error', error);
    }
}

function displayData(data) {
    const mainEL = document.getElementById("main-show");
    data.slice(displayedEvents, displayedEvents + eventsPerPage).forEach(item => {
        let name = item.type;
        let summary = item.summary;
        let text = item.name;
        let textNew = text.split(",");
        let gps = item.location.gps;
        let lonlat = gps.split(",");
        let lat = lonlat[0];
        let lon = lonlat[1];

        let article = document.createElement("article");
        article.classList.add("handelser");
        mainEL.appendChild(article);
        article.innerHTML += `
            <h2>${name}</h2>
            <h3>${summary}</h3>
            <h5>${textNew[0]}  ${textNew[2]}</h5>
            <div id="map-id-${mapCount}" class="map"> <!-- Använder mapCount för att skapa unika ID:n -->
                <div>
            `;
        let map = L.map(`map-id-${mapCount}`).setView([lat, lon], 13);
        mapCount++; 
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map)
            .bindPopup(`Här har händelsen skett`)
            .openPopup();
    });
    displayedEvents += eventsPerPage;
}

getData();


function displayMoreEvents() {
    getData();
}
