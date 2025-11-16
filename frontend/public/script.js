document.getElementById("system_type").addEventListener("change", function () {
    const type = this.value;

    document.getElementById("electric_fields").style.display =
        type === "electric" ? "block" : "none";

    document.getElementById("ice_fields").style.display =
        type === "ice" ? "block" : "none";
});

document.getElementById("uavForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const payload = Object.fromEntries(formData.entries());

    // Convert numeric fields
    for (const key in payload) {
        if (payload[key] !== "" && !isNaN(payload[key])) {
            payload[key] = Number(payload[key]);
        }
    }

    // Assign null to incorrect fields
    if (payload.system_type === "electric") {
        payload.fuel_mass = null;
        payload.prop_efficiency = null;
        payload.engine_power_kw = null;
        payload.bsfc = null;
    }

    if (payload.system_type === "ice") {
        payload.battery_capacity = null;
        payload.system_efficiency = null;
    }

    console.log("SEND:", payload);

    try {
        const response = await fetch("https://streetless-heidy-folkish.ngrok-free.dev/configure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Помилка сервера: " + response.status);
        }

        const data = await response.json();
        console.log("RESPONSE:", data);

        // Output result
        document.getElementById("result").innerHTML = `
            <h2>РЕЗУЛЬТАТИ РОЗРАХУНКУ</h2>

            <p><b>Необхідна тяга:</b> ${data.required_thrust.toFixed(2)} Н</p>
            <p><b>Необхідна потужність:</b> ${data.required_power.toFixed(2)} Вт</p>
            <p><b>Теоретична швидкість повітря гвинтом:</b> ${data.prop_theoretical_speed.toFixed(2)} м/с</p>

            ${data.flight_time_electric !== null 
                ? `<p><b>Час польоту (електро):</b> ${data.flight_time_electric.toFixed(2)} год</p>`
                : ""
            }

            ${data.flight_time_ice !== null 
                ? `<p><b>Час польоту (ДВЗ):</b> ${data.flight_time_ice.toFixed(2)} год</p>`
                : ""
            }

            <hr>

            <p>${data.thrust_explained}</p>
            <p>${data.power_explained}</p>
            <p>${data.prop_speed_explained}</p>
            <p>${data.flight_time_explained}</p>
        `;

        document.getElementById("result").style.display = "block";

    } catch (error) {
        alert("Не вдалося отримати відповідь від сервера.");
        console.error(error);
    }
});
