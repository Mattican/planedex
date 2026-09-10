const addButton = document.getElementById("add-sighting");
const form = document.getElementById("sighting-form");
const saveButton = document.getElementById("save-sighting");
const sightings = document.getElementById("sightings");
const aircraftCollection = document.getElementById("aircraft-collection");
const airlineCollection = document.getElementById("airline-collection");

let planeSightings = JSON.parse(localStorage.getItem("planeSightings")) || [];

addButton.addEventListener("click", function () {
    form.hidden = false;
});

saveButton.addEventListener("click", function () {
    const airline = document.getElementById("airline").value;
    const aircraftType = document.getElementById("aircraft-type").value;
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;

    const isNewAircraft = !planeSightings.some(function (plane) {
        return plane.aircraftType.toLowerCase() === aircraftType.toLowerCase();
    });

   const plane = {
    airline: airline,
    aircraftType: aircraftType,
    origin: origin,
    destination: destination,
    date: date,
    isNewAircraft: isNewAircraft
};  

    planeSightings.push(plane);

    if (isNewAircraft) {
        showNotification(`🆕 NEW AIRCRAFT TYPE! ${aircraftType}`);
    }

    localStorage.setItem("planeSightings", JSON.stringify(planeSightings));

    displaySightings();
    updateCounts();
    updateAircraftCollection();
    updateAirlineCollection();

    form.hidden = true;
});

function displaySightings() {
    sightings.innerHTML = "<h2>Recent sightings</h2>";

    planeSightings.slice(-5).reverse().forEach(function (plane, index) {
        const card = document.createElement("article");

        const realIndex = planeSightings.length - 1 - index;

        card.innerHTML = `
            <h3>✈️ ${plane.airline}</h3>
            <p><strong>Aircraft:</strong> ${plane.aircraftType}</p>
            <p><strong>Route:</strong> ${plane.origin} → ${plane.destination}</p>
            <p><strong>Spotted:</strong> ${plane.date || "Date not recorded"}</p>
            <button class="delete-button" data-index="${realIndex}">
                🗑️ Delete
            </button>
        `;

        sightings.appendChild(card);
    });

    document.querySelectorAll(".delete-button").forEach(function (button) {
        button.addEventListener("click", function () {
            const index = Number(button.dataset.index);

            planeSightings.splice(index, 1);

            localStorage.setItem(
                "planeSightings",
                JSON.stringify(planeSightings)
            );

            displaySightings();
            updateCounts();
            updateAircraftCollection();
            updateAirlineCollection();
        });
    });
}

function updateCounts() {
    const sightingCount = document.getElementById("sighting-count");
    const airlineCount = document.getElementById("airline-count");
    const typeCount = document.getElementById("type-count");

    const airlines = new Set(
        planeSightings.map(function (plane) {
            return plane.airline;
        })
    );

    const aircraftTypes = new Set(
        planeSightings.map(function (plane) {
            return plane.aircraftType;
        })
    );

    sightingCount.textContent = planeSightings.length;
    airlineCount.textContent = airlines.size;
    typeCount.textContent = aircraftTypes.size;
}

function updateAircraftCollection() {
    aircraftCollection.innerHTML = "";

    const aircraft = {};

    planeSightings.forEach(function (plane) {
        if (aircraft[plane.aircraftType]) {
            aircraft[plane.aircraftType]++;
        } else {
            aircraft[plane.aircraftType] = 1;
        }
    });

    Object.keys(aircraft).forEach(function (type) {
        const card = document.createElement("div");

        card.className = "aircraft-card";

        card.innerHTML = `
    <div>
    <strong>🛩️ ${type}</strong>
    ${aircraft[type] === 1 ? '<em class="new-badge">NEW</em>' : ''}
</div>

    <span>${aircraft[type]} sighting${aircraft[type] === 1 ? "" : "s"}</span>
`;

        aircraftCollection.appendChild(card);
    });
}

function updateAirlineCollection() {
    airlineCollection.innerHTML = "";

    const airlines = {};

    planeSightings.forEach(function (plane) {
        if (airlines[plane.airline]) {
            airlines[plane.airline]++;
        } else {
            airlines[plane.airline] = 1;
        }
    });

    Object.keys(airlines).forEach(function (airline) {
        const card = document.createElement("div");

        card.className = "aircraft-card";

        card.innerHTML = `
            <strong>✈️ ${airline}</strong>
            <span>${airlines[airline]} sighting${airlines[airline] === 1 ? "" : "s"}</span>
        `;

        airlineCollection.appendChild(card);
    });
}

displaySightings();
updateCounts();
updateAircraftCollection();
updateAirlineCollection();

function showNotification(message) {
    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.hidden = false;

    setTimeout(function () {
        notification.hidden = true;
    }, 3000);
}   