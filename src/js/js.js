async function getData () {
    try {
        let response = await fetch("https://polisen.se/api/events")
        let data = await response.json();
        getDisplay(data);
    } catch (error) {
        console.error('Error', error);
    }
}

function getDisplay(data) {
    data.forEach(item => {
        let name = item.type;
        let summary = item.summary;
        let text = item.name;
        let textNew = text.split(",");
        let gps = item.location.gps;
        let lonlat = gps.split(",");
        let lat = lonlat[0];
        let lon = lonlat[1];

        let mainEL = document.getElementById("main-show");
        if (name !== "Övrigt" && name !== "Sammanfattning natt" && name !== "Sammanfattning kväll och natt" && name !== "Trafikkontroll" && name !== "Uppdatering") {
            let article = document.createElement("article");
            article.classList.add("handelser"); 
            mainEL.appendChild(article);
            article.innerHTML += `
                <h2>${name}</h2>
                <h3>${summary}</h3>
                <h5>${textNew[0]}  ${textNew[2]}</h5>
                <div id="map-id-${lon}" class="map">
                    <div>
                `;
            let map = L.map(`map-id-${lon}`).setView([lat, lon], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            L.marker([lat, lon]).addTo(map)
                .bindPopup(`Här har händelsen skett`)
                .openPopup();

        }
    });
}

getData();
