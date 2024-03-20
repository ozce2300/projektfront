"use strict";
let mapCount = 0;
let displayedEvents = 0;
let eventsPerPage = 10;
let currentSearch = ""; 
document.getElementById("visa-mer-data").addEventListener("click", displayMoreEvents);
document.getElementById("search-city").addEventListener("click", searchEvents);

async function getData(currentSearch) {
    try {
        let response;
        if (currentSearch) {
            response = await fetch(`https://polisen.se/api/events?locationname=${currentSearch}`);
        } else {
            response = await fetch("https://polisen.se/api/events");
        }
        let data = await response.json();
        displayData(data);
    } catch (error) {
        console.log('Error', error);
    }
}

function displayData(data) {
    const mainEL = document.getElementById("main-show");
    if (displayedEvents === 0) {
        mainEL.innerHTML = ""; 
    }
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
        if (name !== "Övrigt" && name !== "Sammanfattning natt" && name !== "Sammanfattning kväll och natt" && name !== "Trafikkontroll") {
        article.innerHTML += `
            <h2>${name}</h2>
            <h3>${summary}</h3>
            <h5>${textNew[0]}  ${textNew[2]}</h5>
            <div id="map-id-${mapCount}" class="map"><div>
            `;
        let map = L.map(`map-id-${mapCount}`).setView([lat, lon], 13);
        mapCount++; 
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map)
            .bindPopup(`Händelsestaden`)
            .openPopup();
}});
    displayedEvents += eventsPerPage;
}

getData();

function displayMoreEvents() {
    displayedEvents += eventsPerPage; 
    getData(currentSearch); 
}

function searchEvents() {
    currentSearch = document.getElementById("text").value.toLowerCase();
    displayedEvents = 0; 
    mapCount = 0; 
    getData(currentSearch); 
    let RubrikMainEL = document.querySelector(".rubrik-main"); 
    let bigFirstLetter = currentSearch.charAt(0).toUpperCase() + currentSearch.slice(1); 
    RubrikMainEL.textContent = ` Senaste händelserna i ${bigFirstLetter}`; 
}
