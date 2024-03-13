async function getData () {

    try {
    let response = await fetch("https://polisen.se/api/events")
    let data = await response.json();
    getDisplay(data)

}
catch (error) {
    console.error('Error', error);
}}


async function getDisplay(data) {
    try {
       await data.forEach(item => {
        let name = item.type
        let summary = item.summary
        let text = item.name

        let mainEL = document.getElementById("main-show")
        if (name !== "Övrigt" && name !== "Sammanfattning natt"&& name !== "Sammanfattning kväll och natt" && name !== "Trafikkontroll") {
        mainEL.innerHTML += `
        <article class="handelser">
        <h2>${name}</h2>
        <h3>${summary}</h3>
        <h5>${text}</5>
        <article>
        `
    }

        });
    }
    catch (error) {
        console.error('Error', error);
    }}
    


getData()