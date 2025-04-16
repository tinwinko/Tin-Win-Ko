document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);
});

/* ✅ Browser & APK မှာ အသံ မည်ဖို့ Fix */
window.onload = function() {
    document.body.addEventListener("click", function() {
        let audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/16403-download-iphone-note-sms-ringtone-iphone-sms-ringtones-54737.mp3');
        audio.play().catch(error => console.log("First Interaction Required: ", error));
    }, { once: true }); // ✅ တစ်ခါသာ click လိုမယ်
};

function saveEntry() {
    let date = document.getElementById("date").value;
    let company = document.getElementById("company").value;
    let name = document.getElementById("name").value;
    let town = document.getElementById("town").value;
    let quantity = document.getElementById("quantity").value;

    if (!date || !company || !name || !town || !quantity) {
        alert("Please fill all fields.");
        return;
    }

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push({ date, company, name, town, quantity });
    localStorage.setItem("entries", JSON.stringify(entries));

    loadEntries();
    showThumbUp();  
    setTimeout(playSound, 100);  
}

function loadEntries() {
    let selectedDate = document.getElementById("date").value;
    let tableBody = document.getElementById("entry-list");
    tableBody.innerHTML = "";
    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    let filteredEntries = entries.filter(entry => entry.date === selectedDate);

    filteredEntries.forEach((entry, index) => {
        let row = tableBody.insertRow();
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.company}</td>
            <td>${entry.name}</td>
            <td>${entry.town}</td>
            <td>${entry.quantity}</td>
            <td><button class="delete-btn" onclick="deleteEntry(${index})">Delete</button></td>
        `;
    });

    calculateTotalQuantity(filteredEntries);
}

function deleteEntry(index) {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    let selectedDate = document.getElementById("date").value;

    let filteredEntries = entries.filter(entry => entry.date === selectedDate);
    let actualIndex = entries.findIndex(entry => 
        entry.date === filteredEntries[index].date &&
        entry.company === filteredEntries[index].company &&
        entry.name === filteredEntries[index].name &&
        entry.town === filteredEntries[index].town &&
        entry.quantity === filteredEntries[index].quantity
    );

    entries.splice(actualIndex, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    loadEntries();
}


function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let selectedDate = document.getElementById("date").value;

    let townTotals = {};
    let nameTotals = {};
    let checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || {};
    let currentDateChecks = checkedItems[selectedDate] || {};

    filteredEntries.forEach(entry => {
        if (!townTotals[entry.town]) townTotals[entry.town] = 0;
        townTotals[entry.town] += parseInt(entry.quantity);

        let key = `${entry.name} (${entry.town})`;
        if (!nameTotals[key]) nameTotals[key] = 0;
        nameTotals[key] += parseInt(entry.quantity);
    });

    for (let town in townTotals) {
        let townTotal = document.createElement("p");
        townTotal.innerHTML = `<span style="color:red; font-weight:bold;">${town} Total ${townTotals[town]}</span>`;
        totalDiv.appendChild(townTotal);

        for (let key in nameTotals) {
            if (key.includes(`(${town})`)) {
                let container = document.createElement("div");
                container.style.display = "flex";
                container.style.alignItems = "center";
                container.style.justifyContent = "space-between";
                container.style.borderBottom = "1px solid #ddd";
                container.style.padding = "5px 0";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = currentDateChecks[key] || false;
                checkbox.onchange = function () {
                    currentDateChecks[key] = this.checked;
                    checkedItems[selectedDate] = currentDateChecks;
                    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
                };

                let label = document.createElement("span");
                label.innerHTML = `<span style="white-space: nowrap;">✔ ${key} <span style="color:black; font-weight:bold;">${nameTotals[key]}</span></span>`;

                container.appendChild(label);
                container.appendChild(checkbox);
                totalDiv.appendChild(container);
            }
        }
    }
}




/* ✅ Preferred Name Add & Load */
function addPreferred(type) {
    let inputId = `new-${type}`;
    let selectId = `${type}`;
    let value = document.getElementById(inputId).value.trim();

    if (!value) return;
    
    let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
    if (!preferredNames.includes(value)) {
        preferredNames.push(value);
        localStorage.setItem(type, JSON.stringify(preferredNames));
        loadPreferredNames();
    } else {
        alert(`${type} already exists!`);
    }

    document.getElementById(inputId).value = "";
}

function loadPreferredNames() {
    ["company", "name", "town"].forEach(type => {
        let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
        let select = document.getElementById(type);
        select.innerHTML = "<option value=''>Select or Add New</option>";  

        preferredNames.forEach(name => {
            let option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    });
}

/* ✅ 👍 Effect ခေါင်းစည်းမှာ */
function showTitleEffect() {
    let titles = document.querySelectorAll("h2, h3");
    titles.forEach(title => {
        let originalText = title.innerHTML;
        title.innerHTML += " 👍";

        setTimeout(() => {
            title.innerHTML = originalText;
        }, 1000);
    });
}

/* ✅ 👍 လက်မ Effect (Screen အလယ်မှာ ကြီးကြီးလှလှ ပေါ်မယ်) */
function showThumbUp() {
    let thumb = document.createElement("div");
    thumb.className = "thumb-up";
    thumb.innerHTML = "👍";
    document.body.appendChild(thumb);

    setTimeout(() => {
        thumb.remove();
    }, 1500);
}

/* ✅ 🔄 Refresh Function */
function refreshEntries() {
    loadEntries();
    loadPreferredNames();
    console.log("Entries refreshed!");
}

/* ✅ 🔊 "iPhone Notification" အသံ ထည့်ထားသည် */
function playSound() {
    let audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/16403-download-iphone-note-sms-ringtone-iphone-sms-ringtones-54737.mp3');  
    audio.play().then(() => {
        console.log("Sound Played Successfully");
    }).catch(error => {
        console.log("Sound play error: ", error);
    });
}
document.querySelectorAll('.check-container').forEach(container => {
    const checkbox = container.querySelector('input[type="checkbox"]');
    const label = container.querySelector('.name-town-quantity');

    if (checkbox && label) {
        container.appendChild(checkbox); // Checkbox ကို Name နောက်ဆုံးထည့်မယ်
    }
});
document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);
});

window.onload = function() {
    document.body.addEventListener("click", function() {
        let audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/16403-download-iphone-note-sms-ringtone-iphone-sms-ringtones-54737.mp3');
        audio.play().catch(error => console.log("First Interaction Required: ", error));
    }, { once: true });
};

function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let selectedDate = document.getElementById("date").value;

    let companyTotals = {};
    let townTotals = {}; 
    let nameTotals = {}; 
    let checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || {};
    let currentDateChecks = checkedItems[selectedDate] || {};

    filteredEntries.forEach(entry => {
        if (!companyTotals[entry.company]) {
            companyTotals[entry.company] = {};
        }
        if (!companyTotals[entry.company][entry.town]) {
            companyTotals[entry.company][entry.town] = {};
        }
        let key = `${entry.name} (${entry.town})`;
        if (!companyTotals[entry.company][entry.town][key]) {
            companyTotals[entry.company][entry.town][key] = 0;
        }
        companyTotals[entry.company][entry.town][key] += parseInt(entry.quantity);

        if (!townTotals[entry.town]) {
            townTotals[entry.town] = {};
        }
        if (!townTotals[entry.town][key]) {
            townTotals[entry.town][key] = 0;
        }
        townTotals[entry.town][key] += parseInt(entry.quantity);
    });

    for (let town in townTotals) {
        let townHeader = document.createElement("h3");
        townHeader.style.color = "green";
        townHeader.textContent = `🏙️ ${town} Total`;
        totalDiv.appendChild(townHeader);

        for (let key in townTotals[town]) {
            let container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "space-between";
            container.style.borderBottom = "1px solid #ddd";
            container.style.padding = "5px 0";

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = currentDateChecks[key] || false;
            checkbox.onchange = function () {
                currentDateChecks[key] = this.checked;
                checkedItems[selectedDate] = currentDateChecks;
                localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
            };

            let label = document.createElement("span");
            label.innerHTML = `✔ ${key} <span style="color:black; font-weight:bold;">${townTotals[town][key]}</span>`;

            container.appendChild(label);
            container.appendChild(checkbox);
            totalDiv.appendChild(container);
        }
    }

    for (let company in companyTotals) {
        let companyHeader = document.createElement("h4");
        companyHeader.style.color = "blue";
        companyHeader.style.marginTop = "10px";
        companyHeader.textContent = `📌 ${company}`;
        totalDiv.appendChild(companyHeader);

        for (let town in companyTotals[company]) {
            let townTotal = document.createElement("p");
            townTotal.style.color = "red";
            townTotal.style.fontWeight = "bold";
            townTotal.innerHTML = `🏙️ ${town} Total`;
            totalDiv.appendChild(townTotal);

            for (let key in companyTotals[company][town]) {
                let container = document.createElement("div");
                container.style.display = "flex";
                container.style.alignItems = "center";
                container.style.justifyContent = "space-between";
                container.style.borderBottom = "1px solid #ddd";
                container.style.padding = "5px 0";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = currentDateChecks[key] || false;
                checkbox.onchange = function () {
                    currentDateChecks[key] = this.checked;
                    checkedItems[selectedDate] = currentDateChecks;
                    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
                };

                let label = document.createElement("span");
                label.innerHTML = `✔ ${key} <span style="color:black; font-weight:bold;">${companyTotals[company][town][key]}</span>`;

                container.appendChild(label);
                container.appendChild(checkbox);
                totalDiv.appendChild(container);
            }
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);
});

window.onload = function() {
    document.body.addEventListener("click", function() {
        let audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/16403-download-iphone-note-sms-ringtone-iphone-sms-ringtones-54737.mp3');
        audio.play().catch(error => console.log("First Interaction Required: ", error));
    }, { once: true });
};

function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let selectedDate = document.getElementById("date").value;

    let companyTotals = {};
    let townTotals = {}; 
    let nameTotals = {}; 
    let checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || {};
    let currentDateChecks = checkedItems[selectedDate] || {};

    filteredEntries.forEach(entry => {
        if (!companyTotals[entry.company]) {
            companyTotals[entry.company] = {};
        }
        if (!companyTotals[entry.company][entry.town]) {
            companyTotals[entry.company][entry.town] = {};
        }
        let key = `${entry.name} (${entry.town})`;
        if (!companyTotals[entry.company][entry.town][key]) {
            companyTotals[entry.company][entry.town][key] = 0;
        }
        companyTotals[entry.company][entry.town][key] += parseInt(entry.quantity);

        if (!townTotals[entry.town]) {
            townTotals[entry.town] = {};
        }
        if (!townTotals[entry.town][key]) {
            townTotals[entry.town][key] = 0;
        }
        townTotals[entry.town][key] += parseInt(entry.quantity);
    });

    let townCount = 1;
    for (let town in townTotals) {
        let townHeader = document.createElement("h3");
        townHeader.style.color = "green";
        townHeader.innerHTML = `🏙️ ${townCount}. ${town} Total: <span style='color:red; font-weight:bold;'>${Object.values(townTotals[town]).reduce((a, b) => a + b, 0)}</span>`;
        totalDiv.appendChild(townHeader);
        
        let subCount = 1;
        for (let key in townTotals[town]) {
            let container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "space-between";
            container.style.borderBottom = "1px solid #ddd";
            container.style.padding = "5px 0";

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = currentDateChecks[key] || false;
            checkbox.onchange = function () {
                currentDateChecks[key] = this.checked;
                checkedItems[selectedDate] = currentDateChecks;
                localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
            };

            let label = document.createElement("span");
            label.innerHTML = `✔ ${subCount}. ${key} <span style="color:black; font-weight:bold;">${townTotals[town][key]}</span>`;
            subCount++;

            container.appendChild(label);
            container.appendChild(checkbox);
            totalDiv.appendChild(container);
        }
        townCount++;
    }

    let companyCount = 1;
    for (let company in companyTotals) {
        let companyHeader = document.createElement("h4");
        companyHeader.style.color = "blue";
        companyHeader.style.marginTop = "10px";
        companyHeader.innerHTML = `📌 ${companyCount}. ${company}`;
        totalDiv.appendChild(companyHeader);
        companyCount++;

        let townCount = 1;
        for (let town in companyTotals[company]) {
            let townTotal = document.createElement("p");
            townTotal.style.color = "red";
            townTotal.style.fontWeight = "bold";
            townTotal.innerHTML = `🏙️ ${townCount}. ${town} Total: <span style='color:red; font-weight:bold;'>${Object.values(companyTotals[company][town]).reduce((a, b) => a + b, 0)}</span>`;
            totalDiv.appendChild(townTotal);
            
            let subCount = 1;
            for (let key in companyTotals[company][town]) {
                let container = document.createElement("div");
                container.style.display = "flex";
                container.style.alignItems = "center";
                container.style.justifyContent = "space-between";
                container.style.borderBottom = "1px solid #ddd";
                container.style.padding = "5px 0";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = currentDateChecks[key] || false;
                checkbox.onchange = function () {
                    currentDateChecks[key] = this.checked;
                    checkedItems[selectedDate] = currentDateChecks;
                    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
                };

                let label = document.createElement("span");
                label.innerHTML = `✔ ${subCount}. ${key} <span style="color:black; font-weight:bold;">${companyTotals[company][town][key]}</span>`;
                subCount++;

                container.appendChild(label);
                container.appendChild(checkbox);
                totalDiv.appendChild(container);
            }
            townCount++;
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);
});

window.onload = function() {
    document.body.addEventListener("click", function() {
        let audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/16403-download-iphone-note-sms-ringtone-iphone-sms-ringtones-54737.mp3');
        audio.play().catch(error => console.log("First Interaction Required: ", error));
    }, { once: true });
};

function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let selectedDate = document.getElementById("date").value;

    let companyTotals = {};
    let townTotals = {}; 
    let nameTotals = {}; 
    let checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || {};
    let currentDateChecks = checkedItems[selectedDate] || {};

    filteredEntries.forEach(entry => {
        if (!companyTotals[entry.company]) {
            companyTotals[entry.company] = {};
        }
        if (!companyTotals[entry.company][entry.town]) {
            companyTotals[entry.company][entry.town] = {};
        }
        let key = `${entry.name} (${entry.town})`;
        if (!companyTotals[entry.company][entry.town][key]) {
            companyTotals[entry.company][entry.town][key] = 0;
        }
        companyTotals[entry.company][entry.town][key] += parseInt(entry.quantity);

        if (!townTotals[entry.town]) {
            townTotals[entry.town] = 0;
        }
        townTotals[entry.town] += parseInt(entry.quantity);
    });

    let townCount = 1;
    for (let town in townTotals) {
        let townHeader = document.createElement("h3");
        townHeader.style.color = "green";
        townHeader.innerHTML = `🏙️ ${townCount}. ${town} Total: <span style='color:red; font-weight:bold;'>${townTotals[town]}</span>`;
        totalDiv.appendChild(townHeader);
        townCount++;
    }

    let companyCount = 1;
    for (let company in companyTotals) {
        let companyTotalQty = Object.values(companyTotals[company]).reduce((total, townData) => {
            return total + Object.values(townData).reduce((a, b) => a + b, 0);
        }, 0);
        
        let companyHeader = document.createElement("h4");
        companyHeader.style.color = "blue";
        companyHeader.style.marginTop = "10px";
        companyHeader.innerHTML = `📌 ${companyCount}. ${company} Total: <span style='color:red; font-weight:bold;'>${companyTotalQty}</span>`;
        totalDiv.appendChild(companyHeader);
        companyCount++;

        let townCount = 1;
        for (let town in companyTotals[company]) {
            let townTotal = document.createElement("p");
            townTotal.style.color = "red";
            townTotal.style.fontWeight = "bold";
            townTotal.innerHTML = `🏙️ ${townCount}. ${town} Total: <span style='color:red; font-weight:bold;'>${Object.values(companyTotals[company][town]).reduce((a, b) => a + b, 0)}</span>`;
            totalDiv.appendChild(townTotal);
            
            let subCount = 1;
            for (let key in companyTotals[company][town]) {
                let container = document.createElement("div");
                container.style.display = "flex";
                container.style.alignItems = "center";
                container.style.justifyContent = "space-between";
                container.style.borderBottom = "1px solid #ddd";
                container.style.padding = "5px 0";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = currentDateChecks[key] || false;
                checkbox.onchange = function () {
                    currentDateChecks[key] = this.checked;
                    checkedItems[selectedDate] = currentDateChecks;
                    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
                };

                let label = document.createElement("span");
                label.innerHTML = `✔ ${subCount}. ${key} <span style="color:black; font-weight:bold;">${companyTotals[company][town][key]}</span>`;
                subCount++;

                container.appendChild(label);
                container.appendChild(checkbox);
                totalDiv.appendChild(container);
            }
            townCount++;
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);
});

window.onload = function() {
    document.body.addEventListener("click", function() {
        let audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/16403-download-iphone-note-sms-ringtone-iphone-sms-ringtones-54737.mp3');
        audio.play().catch(error => console.log("First Interaction Required: ", error));
    }, { once: true });
};

function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let selectedDate = document.getElementById("date").value;

    let companyTotals = {};
    let townTotals = {}; 
    let checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || {};
    let currentDateChecks = checkedItems[selectedDate] || {};

    filteredEntries.forEach(entry => {
        if (!companyTotals[entry.company]) {
            companyTotals[entry.company] = {};
        }
        if (!companyTotals[entry.company][entry.town]) {
            companyTotals[entry.company][entry.town] = {};
        }
        let key = `${entry.name} (${entry.town})`;
        if (!companyTotals[entry.company][entry.town][key]) {
            companyTotals[entry.company][entry.town][key] = 0;
        }
        companyTotals[entry.company][entry.town][key] += parseInt(entry.quantity);

        if (!townTotals[entry.town]) {
            townTotals[entry.town] = {};
        }
        if (!townTotals[entry.town][key]) {
            townTotals[entry.town][key] = 0;
        }
        townTotals[entry.town][key] += parseInt(entry.quantity);
    });

    let townCount = 1;
    for (let town in townTotals) {
        let townHeader = document.createElement("h3");
        townHeader.style.color = "green";
        townHeader.innerHTML = `🏙️ ${townCount}. ${town} Total: <span style='color:red; font-weight:bold;'>${Object.values(townTotals[town]).reduce((a, b) => a + b, 0)}</span>`;
        totalDiv.appendChild(townHeader);

        let subCount = 1;
        for (let key in townTotals[town]) {
            let container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "space-between";
            container.style.borderBottom = "1px solid #ddd";
            container.style.padding = "5px 0";

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = currentDateChecks[key] || false;
            checkbox.onchange = function () {
                currentDateChecks[key] = this.checked;
                checkedItems[selectedDate] = currentDateChecks;
                localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
            };

            let label = document.createElement("span");
            label.innerHTML = `✔ ${subCount}. ${key} <span style="color:black; font-weight:bold;">${townTotals[town][key]}</span>`;
            subCount++;

            container.appendChild(label);
            container.appendChild(checkbox);
            totalDiv.appendChild(container);
        }
        townCount++;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);
});

window.onload = function() {
    document.body.addEventListener("click", function() {
        let audio = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/16403-download-iphone-note-sms-ringtone-iphone-sms-ringtones-54737.mp3');
        audio.play().catch(error => console.log("First Interaction Required: ", error));
    }, { once: true });
};

function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let selectedDate = document.getElementById("date").value;

    let companyTotals = {};
    let townTotals = {}; 
    let checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || {};
    let currentDateChecks = checkedItems[selectedDate] || {};

    filteredEntries.forEach(entry => {
        if (!companyTotals[entry.company]) {
            companyTotals[entry.company] = {};
        }
        if (!companyTotals[entry.company][entry.town]) {
            companyTotals[entry.company][entry.town] = {};
        }
        let key = `${entry.name} (${entry.town})`;
        if (!companyTotals[entry.company][entry.town][key]) {
            companyTotals[entry.company][entry.town][key] = 0;
        }
        companyTotals[entry.company][entry.town][key] += parseInt(entry.quantity);

        if (!townTotals[entry.town]) {
            townTotals[entry.town] = {};
        }
        if (!townTotals[entry.town][key]) {
            townTotals[entry.town][key] = 0;
        }
        townTotals[entry.town][key] += parseInt(entry.quantity);
    });

    let townCount = 1;
    for (let town in townTotals) {
        let townHeader = document.createElement("h3");
        townHeader.style.color = "green";
        townHeader.innerHTML = `🏙️ ${townCount}. ${town} Total: <span style='color:red; font-weight:bold;'>${Object.values(townTotals[town]).reduce((a, b) => a + b, 0)}</span>`;
        totalDiv.appendChild(townHeader);

        let subCount = 1;
        for (let key in townTotals[town]) {
            let container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "space-between";
            container.style.borderBottom = "1px solid #ddd";
            container.style.padding = "5px 0";

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = currentDateChecks[key] || false;
            checkbox.onchange = function () {
                currentDateChecks[key] = this.checked;
                checkedItems[selectedDate] = currentDateChecks;
                localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
            };

            let label = document.createElement("span");
            label.innerHTML = `✔ ${subCount}. ${key} <span style="color:red; font-weight:bold;">${townTotals[town][key]}</span>`;
            subCount++;

            container.appendChild(label);
            container.appendChild(checkbox);
            totalDiv.appendChild(container);
        }
        townCount++;
    }

    let companyCount = 1;
    for (let company in companyTotals) {
        let companyTotalQty = Object.values(companyTotals[company]).reduce((total, townData) => {
            return total + Object.values(townData).reduce((a, b) => a + b, 0);
        }, 0);
        
        let companyHeader = document.createElement("h4");
        companyHeader.style.color = "blue";
        companyHeader.style.marginTop = "30px";
        companyHeader.innerHTML = `📌 ${companyCount}. ${company} Total: <span style='color:red; font-weight:bold;'>${companyTotalQty}</span>`;
        totalDiv.appendChild(companyHeader);
        companyCount++;

        let townCount = 1;
        for (let town in companyTotals[company]) {
            let townTotal = document.createElement("p");
            townTotal.style.color = "red";
            townTotal.style.fontWeight = "bold";
            townTotal.innerHTML = `🏙️ ${townCount}. ${town} Total: <span style='color:red; font-weight:bold;'>${Object.values(companyTotals[company][town]).reduce((a, b) => a + b, 0)}</span>`;
            totalDiv.appendChild(townTotal);
            
            let subCount = 1;
            for (let key in companyTotals[company][town]) {
                let container = document.createElement("div");
                container.style.display = "flex";
                container.style.alignItems = "center";
                container.style.justifyContent = "space-between";
                container.style.borderBottom = "1px solid #ddd";
                container.style.padding = "5px 0";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = currentDateChecks[key] || false;
                checkbox.onchange = function () {
                    currentDateChecks[key] = this.checked;
                    checkedItems[selectedDate] = currentDateChecks;
                    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
                };

                let label = document.createElement("span");
                label.innerHTML = `✔ ${subCount}. ${key} <span style="color:red; font-weight:bold;">${companyTotals[company][town][key]}</span>`;
                subCount++;

                container.appendChild(label);
                container.appendChild(checkbox);
                totalDiv.appendChild(container);
            }
            townCount++;
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);
});

/* ✅ Preferred Name Sorting */
function loadPreferredNames() {
    ["company", "name", "town"].forEach(type => {
        let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
        preferredNames.sort();  // ✅ Alphabetical Order အတိုင်း စဉ်မယ်
        let select = document.getElementById(type);
        select.innerHTML = "<option value=''>Select or Add New</option>";  

        preferredNames.forEach(name => {
            let option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    });
}
/* ✅ Town Wise & Company Wise Box ထဲမှာ ခြားပြီး ပြမယ် */
function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let townTotals = {};
    let companyTotals = {};

    filteredEntries.forEach(entry => {
        let nameKey = `${entry.name} (${entry.town})`;

        if (!townTotals[entry.town]) townTotals[entry.town] = { total: 0, names: {} };
        townTotals[entry.town].total += parseInt(entry.quantity);
        townTotals[entry.town].names[nameKey] = (townTotals[entry.town].names[nameKey] || 0) + parseInt(entry.quantity);

        if (!companyTotals[entry.company]) companyTotals[entry.company] = { total: 0, towns: {} };
        if (!companyTotals[entry.company].towns[entry.town]) companyTotals[entry.company].towns[entry.town] = { total: 0, names: {} };
        companyTotals[entry.company].total += parseInt(entry.quantity);
        companyTotals[entry.company].towns[entry.town].total += parseInt(entry.quantity);
        companyTotals[entry.company].towns[entry.town].names[nameKey] = (companyTotals[entry.company].towns[entry.town].names[nameKey] || 0) + parseInt(entry.quantity);
    });

    let townHeader = document.createElement("h3");
    townHeader.textContent = "🏙️ Town Wise Total";
    townHeader.classList.add("town-wise-header");
    totalDiv.appendChild(townHeader);

    for (let town in townTotals) {
        let townContainer = document.createElement("div");
        townContainer.classList.add("town-box");

        let townTitle = document.createElement("h4");
        townTitle.innerHTML = `<span class="red-bold">${town} - ${townTotals[town].total}</span>`;
        townContainer.appendChild(townTitle);

        let nameList = document.createElement("ul");
        for (let nameKey in townTotals[town].names) {
            let listItem = document.createElement("li");
            listItem.innerHTML = `✔ ${nameKey} - <span class="red-bold">${townTotals[town].names[nameKey]}</span>`;
            nameList.appendChild(listItem);
        }

        townContainer.appendChild(nameList);
        totalDiv.appendChild(townContainer);
    }

    let companyHeader = document.createElement("h3");
    companyHeader.textContent = "🏢 Company Wise Total";
    companyHeader.classList.add("company-wise-header");
    totalDiv.appendChild(companyHeader);

    for (let company in companyTotals) {
        let companyContainer = document.createElement("div");
        companyContainer.classList.add("company-box");

        let companyTitle = document.createElement("h4");
        companyTitle.innerHTML = `<span class="big-red-bold">${company} - ${companyTotals[company].total}</span>`;
        companyContainer.appendChild(companyTitle);

        for (let town in companyTotals[company].towns) {
            let townSubTitle = document.createElement("h5");
            townSubTitle.innerHTML = `<span class="blue-text">${town} - ${companyTotals[company].towns[town].total}</span>`;
            companyContainer.appendChild(townSubTitle);

            let nameList = document.createElement("ul");
            for (let nameKey in companyTotals[company].towns[town].names) {
                let listItem = document.createElement("li");
                listItem.innerHTML = `✔ ${nameKey} - <span class="red-bold">${companyTotals[company].towns[town].names[nameKey]}</span>`;
                nameList.appendChild(listItem);
            }

            companyContainer.appendChild(nameList);
        }

        totalDiv.appendChild(companyContainer);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadEntries();
    loadPreferredNames();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("date").addEventListener("change", loadEntries);

    // ✅ Name (Town) Quantity ကို Click လုပ်ရင် Red Box ပြောင်း
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("name-town-quantity")) {
            event.target.classList.toggle("selected");
            saveSelection();
        }
    });

    // ✅ Date ပြောင်းတိုင်း Save Data ပြန်ထည့်ရန်
    document.getElementById("date").addEventListener("change", loadSavedSelection);

    // ✅ Saved Selection Data ပြန်တင်ရန်
    loadSavedSelection();
});

// ✅ Selected Name (Town) Quantity တွေကို Local Storage မှာ Save
function saveSelection() {
    let selections = [];
    document.querySelectorAll(".name-town-quantity.selected").forEach(function (element) {
        selections.push(element.innerText);
    });

    let currentDate = document.getElementById("date").value;
    localStorage.setItem("selectedData_" + currentDate, JSON.stringify(selections));
}

// ✅ Date ပြောင်းလိုက်ရင် Saveထားတဲ့ Data တွေ ပြန်ထည့်မယ်
function loadSavedSelection() {
    let currentDate = document.getElementById("date").value;
    let savedData = localStorage.getItem("selectedData_" + currentDate);

    if (savedData) {
        let selections = JSON.parse(savedData);
        document.querySelectorAll(".name-town-quantity").forEach(function (element) {
            if (selections.includes(element.innerText)) {
                element.classList.add("selected");
            } else {
                element.classList.remove("selected");
            }
        });
    }
}

// ✅ Total Quantity ကို Town Wise & Company Wise ခွဲပြမယ်
function calculateTotalQuantity(filteredEntries) {
    let totalDiv = document.getElementById("total-quantity");
    totalDiv.innerHTML = "";
    let townTotals = {};
    let companyTotals = {};

    filteredEntries.forEach(entry => {
        let nameKey = `${entry.name} (${entry.town})`;

        if (!townTotals[entry.town]) townTotals[entry.town] = { total: 0, names: {} };
        townTotals[entry.town].total += parseInt(entry.quantity);
        townTotals[entry.town].names[nameKey] = (townTotals[entry.town].names[nameKey] || 0) + parseInt(entry.quantity);

        if (!companyTotals[entry.company]) companyTotals[entry.company] = { total: 0, towns: {} };
        if (!companyTotals[entry.company].towns[entry.town]) companyTotals[entry.company].towns[entry.town] = { total: 0, names: {} };
        companyTotals[entry.company].total += parseInt(entry.quantity);
        companyTotals[entry.company].towns[entry.town].total += parseInt(entry.quantity);
        companyTotals[entry.company].towns[entry.town].names[nameKey] = (companyTotals[entry.company].towns[entry.town].names[nameKey] || 0) + parseInt(entry.quantity);
    });

    let townHeader = document.createElement("h3");
    townHeader.textContent = "🏙️ Town Wise Total";
    townHeader.classList.add("town-wise-header");
    totalDiv.appendChild(townHeader);

    for (let town in townTotals) {
        let townContainer = document.createElement("div");
        townContainer.classList.add("town-box");

        let townTitle = document.createElement("h4");
        townTitle.innerHTML = `<span class="red-bold">${town} - ${townTotals[town].total}</span>`;
        townContainer.appendChild(townTitle);

        let nameList = document.createElement("ul");
        for (let nameKey in townTotals[town].names) {
            let listItem = document.createElement("li");
            let nameSpan = document.createElement("span");
            nameSpan.classList.add("name-town-quantity");
            nameSpan.innerText = `✔ ${nameKey} - ${townTotals[town].names[nameKey]}`;
            listItem.appendChild(nameSpan);
            nameList.appendChild(listItem);
        }

        townContainer.appendChild(nameList);
        totalDiv.appendChild(townContainer);
    }

    let companyHeader = document.createElement("h3");
    companyHeader.textContent = "🏢 Company Wise Total";
    companyHeader.classList.add("company-wise-header");
    totalDiv.appendChild(companyHeader);

    for (let company in companyTotals) {
        let companyContainer = document.createElement("div");
        companyContainer.classList.add("company-box");

        let companyTitle = document.createElement("h4");
        companyTitle.innerHTML = `<span class="big-red-bold">${company} - ${companyTotals[company].total}</span>`;
        companyContainer.appendChild(companyTitle);

        for (let town in companyTotals[company].towns) {
            let townSubTitle = document.createElement("h5");
            townSubTitle.innerHTML = `<span class="blue-text">${town} - ${companyTotals[company].towns[town].total}</span>`;
            companyContainer.appendChild(townSubTitle);

            let nameList = document.createElement("ul");
            for (let nameKey in companyTotals[company].towns[town].names) {
                let listItem = document.createElement("li");
                let nameSpan = document.createElement("span");
                nameSpan.classList.add("name-town-quantity");
                nameSpan.innerText = `✔ ${nameKey} - ${companyTotals[company].towns[town].names[nameKey]}`;
                listItem.appendChild(nameSpan);
                nameList.appendChild(listItem);
            }

            companyContainer.appendChild(nameList);
        }

        totalDiv.appendChild(companyContainer);
    }

    loadSavedSelection();
}
// Notes Load Function (Date အလိုက် Load ပြုလုပ်မှု)
function loadNotes() {
    let selectedDate = document.getElementById("date").value;
    let notes = localStorage.getItem("notes_" + selectedDate) || ""; 
    document.getElementById("notes").value = notes;
}

// Notes Save Function (Local Storage မှာ သိမ်းမယ်)
function saveNotes() {
    let selectedDate = document.getElementById("date").value;
    let notes = document.getElementById("notes").value;
    localStorage.setItem("notes_" + selectedDate, notes);
}

// Date ပြောင်းလဲသွားရင် Notes ကို ပြန်တင်ရန်
document.getElementById("date").addEventListener("change", loadNotes);

// Page တက်လာတာနဲ့ Notes ကို Auto Load
window.onload = loadNotes;
document.addEventListener("DOMContentLoaded", function () {
    let waveText = document.getElementById("wave-text");
    let text = waveText.textContent;
    waveText.innerHTML = ""; // Clear original text

    text.split("").forEach((char, index) => {
        let span = document.createElement("span");
        span.textContent = char;
        waveText.appendChild(span);
    });
});
function updateTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");
    let ampm = hours >= 12 ? "PM" : "AM";

    // ✅ 12-Hour Format ပြောင်းရန်
    hours = hours % 12 || 12;

    document.getElementById("current-time").textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

// ✅ 1 Second တိုင်း Time ကို Update လုပ်မယ်
setInterval(updateTime, 1000);
updateTime();
// ✅ Town Wise ကို နှိပ်လိုက်ရင် Town Wise Section ကို ပြမယ်
function showTownWise() {
    let townWiseHeader = document.querySelector(".town-wise-header");
    if (townWiseHeader) {
        townWiseHeader.scrollIntoView({ behavior: "smooth" });
    } else {
        alert("No Town Wise Data Available!");
    }
}

// ✅ New Company Button Function
function addNewCompany() {
    let companyName = prompt("Enter New Company Name:");
    if (companyName) {
        // ✅ Local Storage ထဲမှာ သိမ်းမယ်
        localStorage.setItem("lastCompany", companyName);

        alert("New Company Added: " + companyName);
    }
}

// ✅ Popup ပြ Function
function showLastCompany() {
    let lastCompany = localStorage.getItem("lastCompany");
    if (lastCompany) {
        alert("Last Added Company: " + lastCompany);
    } else {
        alert("No company added yet!");
    }
}

// ✅ Notes ကို နှိပ်လိုက်ရင် Notes Box ကို ပြမယ်
function showNotes() {
    let notesBox = document.getElementById("notes");
    if (notesBox) {
        notesBox.scrollIntoView({ behavior: "smooth" });
    } else {
        alert("Notes Box Not Found!");
    }
}
// ✅ Back Button ကို နှိပ်လိုက်ရင် အပေါ်ဆုံး (Header Section) ကို ပြန်သွားမယ်
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
let companyIndex = 0;
let companyList = [];

// ✅ Shield Box ကို ဖွင့်မယ်
function openShield(title, content, isCompany = false) {
    document.getElementById("shield-title").textContent = title;
    document.getElementById("shield-body").innerHTML = content;
    document.getElementById("shield-box").style.display = "flex";

    // ✅ If it's a company popup, show navigation buttons
    if (isCompany) {
        document.querySelector(".company-navigation").style.display = "flex";
    } else {
        document.querySelector(".company-navigation").style.display = "none";
    }
}

// ✅ Shield Box ကို ပိတ်မယ်
function closeShield() {
    document.getElementById("shield-box").style.display = "none";
}

// ✅ New Company Button ကို နှိပ်လိုက်ရင်
function showNewCompany() {
    companyList = [...document.querySelectorAll(".company-box")];
    if (companyList.length > 0) {
        companyIndex = companyList.length - 1; // ✅ Default to last company
        updateCompanyDisplay();
    } else {
        openShield("🏢 New Company", "No Company Data Available.");
    }
}

// ✅ Update the Company Display in Popup
function updateCompanyDisplay() {
    if (companyList.length > 0) {
        let companyData = companyList[companyIndex].innerHTML;
        openShield("🏢 New Company", companyData, true);
    }
}

// ✅ Previous Company
function prevCompany() {
    if (companyIndex > 0) {
        companyIndex--;
        updateCompanyDisplay();
    }
}

// ✅ Next Company
function nextCompany() {
    if (companyIndex < companyList.length - 1) {
        companyIndex++;
        updateCompanyDisplay();
    }
}
function openShield(title, content, showNav = false) {
    document.getElementById("shield-title").innerHTML = 
        title === "New Company" ? "Save Done. ကျေးဇူးပါ🙏" : title;
    document.getElementById("shield-body").innerHTML = content;

    document.querySelector(".company-navigation").style.display = showNav ? "flex" : "none";
    
    document.getElementById("shield-box").style.display = "flex";
}
function searchEntries() {
    let searchName = document.getElementById("search-box").value.trim();
    let selectedDate = document.getElementById("date").value;

    if (!searchName) {
        alert("Please enter a Name to search.");
        return;
    }

    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    // 🔥 Name ကို အပြည့်အစုံ တူမှ ရှာလို့ရအောင် ပြုလုပ်မယ်
    let filteredEntries = entries.filter(entry => 
        entry.name.trim() === searchName && entry.date === selectedDate
    );

    if (filteredEntries.length === 0) {
        alert(`No records found for "${searchName}" on ${selectedDate}.`);
        return;
    }

    let totalQuantity = filteredEntries.reduce((sum, entry) => sum + parseInt(entry.quantity), 0);
    let townOptions = [...new Set(filteredEntries.map(entry => entry.town))];

    let resultHTML = `<h3 id="total-quantity-header">${searchName} - ${selectedDate} - Total: <span id="total-quantity">${totalQuantity}</span></h3>`;
    resultHTML += `<label for="town-filter">Choose Town:</label>`;
    resultHTML += `<select id="town-filter" onchange="filterByTown('${searchName}')">`;
    resultHTML += `<option value="all">All</option>`;

    townOptions.forEach(town => {
        resultHTML += `<option value="${town}">${town}</option>`;
    });

    resultHTML += `</select><div id="filtered-results"></div>`;

    showPopup(resultHTML);
    filterByTown(searchName);
}

function filterByTown(name) {
    let selectedTown = document.getElementById("town-filter").value;
    let selectedDate = document.getElementById("date").value;
    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    let filteredEntries = entries.filter(entry => 
        entry.name.trim() === name && entry.date === selectedDate
    );

    if (selectedTown !== "all") {
        filteredEntries = filteredEntries.filter(entry => entry.town === selectedTown);
    }

    let totalQuantity = filteredEntries.reduce((sum, entry) => sum + parseInt(entry.quantity), 0);
    
    let totalQuantityElement = document.querySelector("#total-quantity");
    if (totalQuantityElement) {
        totalQuantityElement.innerText = totalQuantity;
    }

    let resultHTML = `<ul>`;
    filteredEntries.forEach(entry => {
        resultHTML += `<li>${entry.company} | ${entry.town} | ${entry.quantity}</li>`;
    });
    resultHTML += `</ul>`;

    document.getElementById("filtered-results").innerHTML = resultHTML;
}

function showPopup(content) {
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.border = "2px solid black";
    popup.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
    popup.style.zIndex = "1000";
    popup.style.textAlign = "center";

    popup.innerHTML = content + `<br><br><button onclick="closePopup()">Close</button>`;

    document.body.appendChild(popup);
}

function closePopup() {
    document.body.removeChild(document.body.lastChild);
}
// ✅ Notes Popup ပြရန်
function showNotesPopup() {
    let selectedDate = document.getElementById("date").value;
    let notes = localStorage.getItem("notes_" + selectedDate) || "";
    document.getElementById("popup-notes").value = notes;
    document.getElementById("notes-popup").style.display = "flex";
}

// ✅ Notes Popup ပိတ်ရန်
function closeNotesPopup() {
    document.getElementById("notes-popup").style.display = "none";
}

// ✅ Notes ကို သိမ်းရန်
function saveNotes() {
    let selectedDate = document.getElementById("date").value;
    let notes = document.getElementById("popup-notes").value;
    localStorage.setItem("notes_" + selectedDate, notes);
    alert("Notes saved successfully!");
    closeNotesPopup();
}

// ✅ Date ပြောင်းတိုင်း Notes ကို ပြန်တင်ရန်
document.getElementById("date").addEventListener("change", function() {
    let selectedDate = document.getElementById("date").value;
    let notes = localStorage.getItem("notes_" + selectedDate) || "";
    document.getElementById("popup-notes").value = notes;
});
// ✅ Menu Dropdown Toggle Function
function toggleMenu() {
    let menu = document.getElementById("menu-dropdown");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// ✅ Theme Setting Function (Light / Dark Mode)
function setTheme(mode) {
    if (mode === "dark") {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
}

// ✅ Load Theme From Local Storage
document.addEventListener("DOMContentLoaded", function () {
    let savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
});

// ✅ Backup Function (Zip & Encrypt with Password)
function backupToZipWithPassword() {
    let zip = new JSZip();
    let dataToBackup = { message: "Hello, this is a backup file!", timestamp: new Date().toISOString() };

    let password = prompt("Enter a password for encryption:");
    if (!password) return;

    let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToBackup), password).toString();
    zip.file("backup.json", encryptedData);

    zip.generateAsync({ type: "blob" }).then(function (content) {
        let date = new Date().toISOString().split("T")[0];
        let a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `backup_${date}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// ✅ Restore Function (Unzip & Decrypt with Password)
function restoreFromGoogleDrive() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "application/zip";

    input.onchange = function (event) {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            JSZip.loadAsync(e.target.result).then(function (zip) {
                return zip.file("backup.json").async("string");
            }).then(function (encryptedData) {
                let password = prompt("Enter the decryption password:");
                let decryptedData = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);

                if (!decryptedData) {
                    alert("Incorrect Password!");
                    return;
                }

                let restoredData = JSON.parse(decryptedData);
                document.getElementById("restore-output").innerText = JSON.stringify(restoredData, null, 2);
            });
        };

        reader.readAsArrayBuffer(file);
    };

    input.click();
}
function showLastCompany() {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    if (entries.length === 0) {
        alert("No entries found.");
        return;
    }

    // 🔹 ယခုရွေးထားတဲ့ Date ကိုယူမယ်
    let selectedDate = document.getElementById("date").value;

    // 🔹 ယခု Date ထဲမှာရှိတဲ့ Company တွေကို ရှာမယ်
    let dateEntries = entries.filter(entry => entry.date === selectedDate);
    
    if (dateEntries.length === 0) {
        alert(`No data found for ${selectedDate}`);
        return;
    }

    // 🔹 နောက်ဆုံးထည့်ထားတဲ့ Company ကိုယူမယ်
    let lastCompany = dateEntries[dateEntries.length - 1].company;

    // 🔹 အဲ့ဒီ Company & Date အတွက် Data တွေကို ရှာမယ်
    let filteredEntries = dateEntries.filter(entry => entry.company === lastCompany);

    if (filteredEntries.length === 0) {
        alert(`No data found for ${lastCompany} on ${selectedDate}`);
        return;
    }

    // 🔹 Shield Box ကို ပြမယ်
    let shieldBox = document.getElementById("shield-box");
    let shieldTitle = document.getElementById("shield-title");
    let shieldBody = document.getElementById("shield-body");

    shieldTitle.innerHTML = `📌 ${lastCompany} ( ${selectedDate} )`;
    shieldBody.innerHTML = ""; // Previous content ကိုဖျက်မယ်

    let townTotals = {};
    let nameTotals = {};

    // 🔹 Town Wise Data တွေစုမယ်
    filteredEntries.forEach(entry => {
        if (!townTotals[entry.town]) townTotals[entry.town] = 0;
        townTotals[entry.town] += parseInt(entry.quantity);

        let key = `${entry.name} (${entry.town})`;
        if (!nameTotals[key]) nameTotals[key] = 0;
        nameTotals[key] += parseInt(entry.quantity);
    });

    // 🔹 Company Total
    let companyTotal = filteredEntries.reduce((sum, entry) => sum + parseInt(entry.quantity), 0);
    shieldBody.innerHTML += `<h3 style="color:blue;">Total Quantity: ${companyTotal}</h3>`;

    // 🔹 Town Wise Breakdown
    for (let town in townTotals) {
        shieldBody.innerHTML += `<h4 style="color:red;">🏙️ ${town} Total: ${townTotals[town]}</h4>`;
        
        for (let key in nameTotals) {
            if (key.includes(`(${town})`)) {
                shieldBody.innerHTML += `<p>✔ ${key}: <strong>${nameTotals[key]}</strong></p>`;
            }
        }
    }

    shieldBox.style.display = "flex"; // Popup Show
}
function openCalculator() {
    document.getElementById("calculator-popup").style.display = "flex";
}

function closeCalculator() {
    document.getElementById("calculator-popup").style.display = "none";
}

function appendToDisplay(value) {
    document.getElementById("calc-display").value += value;
}

function clearDisplay() {
    document.getElementById("calc-display").value = "";
}

function calculateResult() {
    try {
        document.getElementById("calc-display").value = eval(document.getElementById("calc-display").value);
    } catch {
        alert("Invalid calculation!");
    }
}
/* ✅ Edit Preferred Name */
function editPreferred(type) {
    let select = document.getElementById(type);
    let selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption || selectedOption.value === "") {
        alert(`Please select a ${type} to edit.`);
        return;
    }
    
    let newValue = prompt(`Edit ${type}:`, selectedOption.value);
    if (newValue && newValue.trim() !== "" && newValue !== selectedOption.value) {
        let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
        let index = preferredNames.indexOf(selectedOption.value);
        
        if (index !== -1) {
            preferredNames[index] = newValue.trim();
            localStorage.setItem(type, JSON.stringify(preferredNames));
            loadPreferredNames();
            alert(`${type} updated successfully!`);
        }
    }
}

/* ✅ Delete Preferred Name */
function deletePreferred(type) {
    let select = document.getElementById(type);
    let selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption || selectedOption.value === "") {
        alert(`Please select a ${type} to delete.`);
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${selectedOption.value}"?`)) {
        let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
        let updatedNames = preferredNames.filter(name => name !== selectedOption.value);
        
        localStorage.setItem(type, JSON.stringify(updatedNames));
        loadPreferredNames();
        alert(`${type} deleted successfully!`);
    }
}
/* ✅ Edit Preferred Name */
function editPreferred(type) {
    let select = document.getElementById(type);
    let selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption || selectedOption.value === "") {
        alert(`Please select a ${type} to edit.`);
        return;
    }
    
    let newValue = prompt(`Edit ${type}:`, selectedOption.value);
    if (newValue && newValue.trim() !== "" && newValue !== selectedOption.value) {
        let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
        let index = preferredNames.indexOf(selectedOption.value);
        
        if (index !== -1) {
            preferredNames[index] = newValue.trim();
            localStorage.setItem(type, JSON.stringify(preferredNames));
            loadPreferredNames();
            alert(`${type} updated successfully!`);
        }
    }
}

/* ✅ Delete Preferred Name */
function deletePreferred(type) {
    let select = document.getElementById(type);
    let selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption || selectedOption.value === "") {
        alert(`Please select a ${type} to delete.`);
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${selectedOption.value}"?`)) {
        let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
        let updatedNames = preferredNames.filter(name => name !== selectedOption.value);
        
        localStorage.setItem(type, JSON.stringify(updatedNames));
        loadPreferredNames();
        alert(`${type} deleted successfully!`);
    }
}

/* ✅ Modified loadPreferredNames Function */
function loadPreferredNames() {
    ["company", "name", "town"].forEach(type => {
        let preferredNames = JSON.parse(localStorage.getItem(type)) || [];
        preferredNames.sort();
        let select = document.getElementById(type);
        
        // Save current selected value
        let currentValue = select.value;
        
        select.innerHTML = "<option value=''>Select or Add New</option>";
        
        preferredNames.forEach(name => {
            let option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
        
        // Restore selection if it still exists
        if (currentValue && preferredNames.includes(currentValue)) {
            select.value = currentValue;
        }
    });
}
function copyExcelFormattedText() {
    const selectedDate = document.getElementById("date").value;
    if (!selectedDate) {
        alert("📅 Please select a date.");
        return;
    }

    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    const filtered = entries.filter(e => e.date === selectedDate);

    if (!filtered.length) {
        alert("😕 No data found for selected date.");
        return;
    }

    const townTotals = {};
    const companyTotals = {};
    const companyTownTotals = {};
    const nameTownTotals = {};  // ✅ new

    filtered.forEach(entry => {
        const qty = parseInt(entry.quantity || 0);

        // Town total
        townTotals[entry.town] = (townTotals[entry.town] || 0) + qty;

        // Company total
        companyTotals[entry.company] = (companyTotals[entry.company] || 0) + qty;

        // Company-Town breakdown
        if (!companyTownTotals[entry.company]) companyTownTotals[entry.company] = {};
        companyTownTotals[entry.company][entry.town] =
            (companyTownTotals[entry.company][entry.town] || 0) + qty;

        // ✅ Name (Town) summary
        const key = `${entry.name} (${entry.town})`;
        nameTownTotals[key] = (nameTownTotals[key] || 0) + qty;
    });

    let output = `Entries for ${selectedDate}\n\n`;

    output += "1. All Entries\nDate\tCompany\tName\tTown\tQuantity\n";
    filtered.forEach(e => {
        output += `${e.date}\t${e.company}\t${e.name}\t${e.town}\t${e.quantity}\n`;
    });

    output += "\n2. Town Wise Summary\nTown\tTotal Quantity\n";
    for (let town in townTotals) {
        output += `${town}\t${townTotals[town]}\n`;
    }

    output += "\n3. Company Wise Summary\nCompany\tTotal Quantity\n";
    for (let c in companyTotals) {
        output += `${c}\t${companyTotals[c]}\n`;
    }

    output += "\n4. Company-Town Breakdown\nCompany\tTown\tQuantity\n";
    for (let c in companyTownTotals) {
        for (let town in companyTownTotals[c]) {
            output += `${c}\t${town}\t${companyTownTotals[c][town]}\n`;
        }
    }

    // ✅ New Section: Name (Town) Total Quantity
    output += "\n5. Name (Town) Summary\nName (Town)\tTotal Quantity\n";
    for (let key in nameTownTotals) {
        output += `${key}\t${nameTownTotals[key]}\n`;
    }

    navigator.clipboard.writeText(output).then(() => {
        alert("📋 Copied with Name (Town) Summary! Now paste into Excel or Google Sheets.");
    });
}
function printTable() {
    const printContents = document.querySelector("table").outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload(); // ပြန် Refresh
}
function setTheme(mode) {
    document.body.classList.remove("light-mode", "dark-mode", "colorful-mode", "retro-mode", "neon-mode");
    document.body.classList.add(`${mode}-mode`);
    localStorage.setItem("theme", mode);
}

function changeTheme(value) {
    setTheme(value);
}

window.onload = () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) themeSelect.value = savedTheme;
}
function copyNotes() {
    const notesText = document.getElementById("popup-notes").value;
    navigator.clipboard.writeText(notesText).then(() => {
        alert("Notes copied to clipboard!");
    });
}
function saveTableAsImage() {
    const table = document.querySelector("table");
    if (!table) {
        alert("No table found!");
        return;
    }

    html2canvas(table).then(canvas => {
        const link = document.createElement("a");
        link.download = "saved-entries.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function refreshEntries() {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];

    const tableBody = document.getElementById("entry-list");
    const totalList = document.getElementById("total-quantity");

    tableBody.innerHTML = "";
    totalList.innerHTML = "";

    let totalQuantity = 0;

    entries.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.company}</td>
            <td>${entry.name}</td>
            <td>${entry.town}</td>
            <td>${entry.quantity}</td>
            <td><button class="delete-btn" onclick="deleteEntry(${index})">🗑️</button></td>
        `;
        tableBody.appendChild(row);
        totalQuantity += Number(entry.quantity);
    });

    const totalItem = document.createElement("li");
    totalItem.textContent = `Total Quantity: ${totalQuantity}`;
    totalList.appendChild(totalItem);
}
function copyEntriesBySelectedDate() {
    const selectedDate = document.getElementById("date").value;
    if (!selectedDate) {
        alert("📅 Please select a date first.");
        return;
    }

    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    const filteredEntries = entries.filter(entry => entry.date === selectedDate);

    if (filteredEntries.length === 0) {
        alert(`😕 No entries found for ${selectedDate}`);
        return;
    }

    // Create tab-separated values for Google Sheets
    let csvContent = "Date\tCompany\tName\tTown\tQuantity\n"; // Header row
    
    filteredEntries.forEach(entry => {
        csvContent += `${entry.date}\t${entry.company}\t${entry.name}\t${entry.town}\t${entry.quantity}\n`;
    });

    // Add summary section
    const companyTotals = {};
    const townTotals = {};
    
    filteredEntries.forEach(entry => {
        companyTotals[entry.company] = (companyTotals[entry.company] || 0) + parseInt(entry.quantity);
        townTotals[entry.town] = (townTotals[entry.town] || 0) + parseInt(entry.quantity);
    });

    csvContent += "\nCompany Totals:\n";
    for (const [company, total] of Object.entries(companyTotals)) {
        csvContent += `${company}\t${total}\n`;
    }

    csvContent += "\nTown Totals:\n";
    for (const [town, total] of Object.entries(townTotals)) {
        csvContent += `${town}\t${total}\n`;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(csvContent)
        .then(() => {
            alert(`✅ Data for ${selectedDate} copied in Google Sheets format!\nPaste directly into Google Sheets.`);
        })
        .catch(err => {
            alert("❌ Copy failed: " + err);
        });
}
function searchEntries() {
    const searchTerm = document.getElementById("search-box").value.trim().toLowerCase();
    const selectedDate = document.getElementById("date").value;
    const entries = JSON.parse(localStorage.getItem("entries")) || [];

    const filteredEntries = entries.filter(entry =>
        entry.date === selectedDate &&
        entry.name.toLowerCase().includes(searchTerm)
    );

    const tableBody = document.getElementById("entry-list");
    tableBody.innerHTML = "";

    filteredEntries.forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.company}</td>
            <td>${entry.name}</td>
            <td>${entry.town}</td>
            <td>${entry.quantity}</td>
            <td><button class="delete-btn" onclick="deleteEntry(${index})">Delete</button></td>
        `;
    });
}
function closeApp() {
    if (typeof Android !== "undefined" && typeof Android.closeApp === "function") {
      Android.closeApp();
    } else {
      alert("This close button only works inside the app.");
    }
  }
  function refreshUI() {
    // နေရာတိုင်းကို clear / reload တော့ theme မပျက်
    // ตัวอย่าง: Form တွေ reset, Table တွေ reload
    document.getElementById("company").value = "";
    document.getElementById("name").value = "";
    document.getElementById("town").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("search-box").value = "";
  
    // Entry List ပြန်ပြ
    loadEntries();
  
    // Theme, LocalStorage, Layout မထိဘူး!
  }
  function getTownWiseData(selectedDate) {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    const dataByTown = {};
  
    entries.forEach(entry => {
      if (entry.date.startsWith(selectedDate)) {
        if (!dataByTown[entry.town]) dataByTown[entry.town] = {};
        if (!dataByTown[entry.town][entry.name]) dataByTown[entry.town][entry.name] = 0;
        dataByTown[entry.town][entry.name] += entry.quantity;
      }
    });
  
    return dataByTown;
  }
  
  function openTownWisePopup() {
    const modal = document.getElementById("townWiseModal");
    modal.style.display = "flex";
  
    const townButtonList = document.getElementById("townButtonList");
    const townContentView = document.getElementById("townContentView");
    const selectedDate = document.getElementById("date").value;
  
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
  
    const dataByTown = {};
    const townTotals = {}; // ✅ Town-wise total quantity
  
    entries.forEach(entry => {
      if (entry.date.startsWith(selectedDate)) {
        if (!dataByTown[entry.town]) {
          dataByTown[entry.town] = [];
          townTotals[entry.town] = 0;
        }
  
        dataByTown[entry.town].push(entry);
        townTotals[entry.town] += parseInt(entry.quantity);
      }
    });
  
    townButtonList.innerHTML = "";
    townContentView.innerHTML = "<em>Select a town to view details</em>";
  
    for (const town in dataByTown) {
      const btn = document.createElement("button");
      // ✅ Town Name (Total Quantity)
      btn.textContent = `${town} (${townTotals[town]})`;
  
      btn.onclick = () => {
        const records = dataByTown[town];
        const nameTotals = {};
  
        records.forEach(entry => {
          if (!nameTotals[entry.name]) {
            nameTotals[entry.name] = 0;
          }
          nameTotals[entry.name] += parseInt(entry.quantity);
        });
  
        let html = "";
        for (const name in nameTotals) {
          html += `
            <div style="margin-bottom: 8px;">
              <strong style="color: red;">${name}</strong> (${town}) - 
              <strong style="color: red;">${nameTotals[name]}</strong>
            </div>
          `;
        }
  
        townContentView.innerHTML = html;
      };
  
      townButtonList.appendChild(btn);
    }
  }
  
  function closeTownWisePopup() {
    document.getElementById("townWiseModal").style.display = "none";
  }
  function openTownWisePopup() {
    const modal = document.getElementById("townWiseModal");
    modal.style.display = "flex";
    
    const townButtonList = document.getElementById("townButtonList");
    const townContentView = document.getElementById("townContentView");
    const selectedDate = document.getElementById("date").value;
    
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    
    // Clear previous content
    townButtonList.innerHTML = "";
    townContentView.innerHTML = "<em>Select a town to view details</em>";
    
    // Group data by town and calculate totals
    const dataByTown = {};
    const townTotals = {};
    
    entries.forEach(entry => {
      if (entry.date.startsWith(selectedDate)) {
        if (!dataByTown[entry.town]) {
          dataByTown[entry.town] = [];
          townTotals[entry.town] = 0;
        }
        dataByTown[entry.town].push(entry);
        townTotals[entry.town] += parseInt(entry.quantity);
      }
    });
    
    // Create buttons for each town
    for (const town in dataByTown) {
      const btn = document.createElement("button");
      btn.textContent = `${town} (${townTotals[town]})`;
      
      btn.onclick = () => {
        const records = dataByTown[town];
        const nameTotals = {};
        
        // Calculate name totals within this town
        records.forEach(entry => {
          if (!nameTotals[entry.name]) {
            nameTotals[entry.name] = 0;
          }
          nameTotals[entry.name] += parseInt(entry.quantity);
        });
        
        // Generate HTML content
        let html = `<h4 style="color: #007bff; margin-bottom: 10px;">${town} - Total: ${townTotals[town]}</h4>`;
        
        // Sort names alphabetically
        const sortedNames = Object.keys(nameTotals).sort();
        
        for (const name of sortedNames) {
          html += `
            <div style="margin-bottom: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
              <strong style="color: #dc3545;">${name}</strong> - 
              <strong style="color: #28a745;">${nameTotals[name]}</strong>
            </div>
          `;
        }
        
        townContentView.innerHTML = html;
        
        // Auto-scroll to top of content
        townContentView.scrollTo(0, 0);
      };
      
      townButtonList.appendChild(btn);
    }
    
    // If only one town, automatically show its data
    if (Object.keys(dataByTown).length === 1) {
      townButtonList.querySelector('button').click();
    }
    
    // Auto-scroll to top of buttons
    townButtonList.scrollTo(0, 0);
  }
html += `
  <div style="margin-bottom: 8px;">
    <span class="town-name">${name}</span> (${town}) - 
    <span class="town-qty">${nameTotals[name]}</span>
  </div>
`;
// ✅ Calculator Open & Close
function openCalculator() {
    document.getElementById('calculator').style.display = 'flex';
}

function closeCalculator() {
    document.getElementById('calculator').style.display = 'none';
}

// ✅ Calculator Logic
function appendToCalc(value) {
    const display = document.getElementById('calc-display');
    display.value += value;
}

function clearCalc() {
    document.getElementById('calc-display').value = '';
}

function calculateCalc() {
    const display = document.getElementById('calc-display');
    try {
        display.value = eval(display.value);
    } catch {
        display.value = 'Error';
    }
}
// ✅ Show Debt Popup
function showDebtPopup() {
    const popup = document.getElementById("debt-popup");
    const textarea = document.getElementById("debt-textarea");
    let saved = localStorage.getItem("debt-list") || "";
    textarea.value = saved;
    popup.style.display = "flex";
}

// ✅ Close Popup
function closeDebtPopup() {
    document.getElementById("debt-popup").style.display = "none";
}

// ✅ Save to Local Storage
function saveDebt() {
    const text = document.getElementById("debt-textarea").value;
    localStorage.setItem("debt-list", text);
    alert("အကြွေးစာရင်း သိမ်းပြီးပါပြီ။");
}

// ✅ Delete Data (Manual Only)
function deleteDebt() {
    if (confirm("ဖျက်မှာသေချာလား?")) {
        localStorage.removeItem("debt-list");
        document.getElementById("debt-textarea").value = "";
    }
}
let currentDebtTab = "receive";

function showDebtPopup() {
    document.getElementById("debt-popup").style.display = "block";

    // Restore tab
    const lastTab = localStorage.getItem("debt-tab") || "receive";
    switchDebtTab(lastTab);

    // Restore values
    document.getElementById("debt-receive").value = localStorage.getItem("debt-receive") || "";
    document.getElementById("debt-owe").value = localStorage.getItem("debt-owe") || "";
}
function switchDebtTab(tab) {
    currentDebtTab = tab;
    document.getElementById("debt-owe").style.display = tab === "owe" ? "block" : "none";
    document.getElementById("debt-receive").style.display = tab === "receive" ? "block" : "none";
    document.getElementById("tab-owe").classList.toggle("tab-active", tab === "owe");
    document.getElementById("tab-receive").classList.toggle("tab-active", tab === "receive");
    localStorage.setItem("debt-tab", tab);
}

function saveDebt() {
    localStorage.setItem("debt-owe", document.getElementById("debt-owe").value);
    localStorage.setItem("debt-receive", document.getElementById("debt-receive").value);
    alert("✅ စာရင်းများ သိမ်းပြီးပါပြီ။");
}

function clearDebt() {
    if (confirm("ဖျက်မှာသေချာလား?")) {
        document.getElementById("debt-owe").value = "";
        document.getElementById("debt-receive").value = "";
        localStorage.removeItem("debt-owe");
        localStorage.removeItem("debt-receive");
    }
}

function closeDebtPopup() {
    document.getElementById("debt-popup").style.display = "none";
}
function switchDebtTab(tab) {
    const receiveBox = document.getElementById("debt-receive");
    const oweBox = document.getElementById("debt-owe");
    const btnReceive = document.getElementById("tab-receive");
    const btnOwe = document.getElementById("tab-owe");

    if (!receiveBox || !oweBox || !btnReceive || !btnOwe) {
        alert("Element IDs မတွေ့ပါ။ ID တွေစစ်ကြည့်ပါ။");
        return;
    }

    if (tab === "receive") {
        receiveBox.style.display = "block";
        oweBox.style.display = "none";
        btnReceive.classList.add("tab-active");
        btnOwe.classList.remove("tab-active");
    } else {
        oweBox.style.display = "block";
        receiveBox.style.display = "none";
        btnOwe.classList.add("tab-active");
        btnReceive.classList.remove("tab-active");
    }

    currentDebtTab = tab;
    localStorage.setItem("debt-tab", tab);
}
function copyMonthlySummary() {
    const allEntries = JSON.parse(localStorage.getItem("entries") || "[]");

    if (!allEntries.length) {
        alert("📭 Save Entries မရှိသေးပါ။");
        return;
    }

    // Group entries by date
    const groupedByDate = {};

    allEntries.forEach(entry => {
        const date = entry.date || "Unknown";
        if (!groupedByDate[date]) groupedByDate[date] = [];
        groupedByDate[date].push(entry);
    });

    const allDates = Object.keys(groupedByDate).sort();
    let output = "TKO Monthly Summary (From Save Entries)\n\n";

    allDates.forEach(date => {
        const entries = groupedByDate[date];
        if (!entries || entries.length === 0) return;

        const townTotals = {};
        const companyTotals = {};
        const nameTownTotals = {};

        entries.forEach(entry => {
            const qty = parseInt(entry.quantity || 0);

            townTotals[entry.town] = (townTotals[entry.town] || 0) + qty;
            companyTotals[entry.company] = (companyTotals[entry.company] || 0) + qty;

            const key = `${entry.name} (${entry.town})`;
            nameTownTotals[key] = (nameTownTotals[key] || 0) + qty;
        });

        output += `Date: ${date}\n`;
        output += "Name\tTown\tCompany\tQuantity\n";
        entries.forEach(e => {
            output += `${e.name}\t${e.town}\t${e.company}\t${e.quantity}\n`;
        });

        output += "\nTown Wise\nTown\tTotal Quantity\n";
        for (let town in townTotals) {
            output += `${town}\t${townTotals[town]}\n`;
        }

        output += "\nCompany Wise\nCompany\tTotal Quantity\n";
        for (let comp in companyTotals) {
            output += `${comp}\t${companyTotals[comp]}\n`;
        }

        output += "\nName (Town) Wise\nName (Town)\tTotal Quantity\n";
        for (let nt in nameTownTotals) {
            output += `${nt}\t${nameTownTotals[nt]}\n`;
        }

        output += "\n-----------------------------\n\n";
    });

    navigator.clipboard.writeText(output).then(() => {
        alert("📋 တစ်လစာ Save Entries Summary ကို Copy လုပ်ပြီးပါပြီ! Excel / Sheets ထဲ Paste လုပ်နိုင်ပါပြီ။");
    });
}
function showDebtPopup() {
    document.getElementById("debt-popup").style.display = "block";
  
    setTimeout(() => {
      switchDebtTab("receive");
    }, 100); // 100ms နောက်မှ run
  }
  function switchDebtTab(tab) {
    const receiveBox = document.getElementById("debt-receive");
    const oweBox = document.getElementById("debt-owe");
    const btnReceive = document.getElementById("tab-receive");
    const btnOwe = document.getElementById("tab-owe");

    if (!receiveBox || !oweBox || !btnReceive || !btnOwe) {
        console.warn("Debt tab elements not found yet.");
        return;
    }

    // Rest of tab switching code...
}
function backupData() {
    const data = localStorage.getItem("entries") || "[]";
    navigator.clipboard.writeText(data).then(() => {
        alert("✅ Backup Data ကို Copy လုပ်ပြီးပါပြီ!");
    });
}

function toggleRestoreBox() {
    const box = document.getElementById("restore-section");
    box.style.display = box.style.display === "none" ? "block" : "none";
}

function restoreData() {
    const raw = document.getElementById("restore-box").value;

    try {
        const incoming = JSON.parse(raw);
        if (!Array.isArray(incoming)) {
            alert("❌ Format မှားနေပါတယ် (Array မဟုတ်ပါ)။");
            return;
        }

        const existing = JSON.parse(localStorage.getItem("entries") || "[]");

        // Create unique key for each entry (Date + Name + Town + Company + Quantity)
        const existingKeys = new Set(
            existing.map(e => `${e.date}|${e.name}|${e.town}|${e.company}|${e.quantity}`)
        );

        // Filter only new entries not found in existing
        const newEntries = incoming.filter(e => {
            const key = `${e.date}|${e.name}|${e.town}|${e.company}|${e.quantity}`;
            return !existingKeys.has(key);
        });

        if (newEntries.length === 0) {
            alert("⚠️ မပါသေးတဲ့ Entry မရှိပါ။ Restore မလုပ်ပါဘူး။");
            return;
        }

        const combined = existing.concat(newEntries);
        localStorage.setItem("entries", JSON.stringify(combined));
        alert(`✅ Restore ပြီးပါပြီ။ ${newEntries.length} ခု သစ် Entry များ ပြန်သွင်းပြီးပါပြီ။`);
        document.getElementById("restore-box").value = "";

    } catch (e) {
        alert("❌ JSON Format မှားနေပါတယ်။ Paste ကိုစစ်ကြည့်ပါ။");
    }
}
function showDebtPopup() {
    document.getElementById("debt-overlay").style.display = "flex";
  
    setTimeout(() => {
      switchDebtTab("receive");
      // Load data into textarea here...
    }, 100);
  }
  
  function closeDebtPopup() {
    document.getElementById("debt-overlay").style.display = "none";
  }
  function switchDebtTab(tab) {
    const receive = document.getElementById("debt-receive");
    const owe = document.getElementById("debt-owe");
    const btnR = document.getElementById("tab-receive");
    const btnO = document.getElementById("tab-owe");

    if (!receive || !owe || !btnR || !btnO) return;

    if (tab === 'receive') {
        receive.style.display = 'block';
        owe.style.display = 'none';
        btnR.classList.add("tab-active");
        btnO.classList.remove("tab-active");
    } else {
        receive.style.display = 'none';
        owe.style.display = 'block';
        btnO.classList.add("tab-active");
        btnR.classList.remove("tab-active");
    }
}

function showDebtPopup() {
    document.getElementById("debt-overlay").style.display = "flex";
    setTimeout(() => switchDebtTab("receive"), 100);
}

function closeDebtPopup() {
    document.getElementById("debt-overlay").style.display = "none";
}

function saveDebt() {
    const r = document.getElementById("debt-receive").value;
    const o = document.getElementById("debt-owe").value;
    localStorage.setItem("debt-receive", r);
    localStorage.setItem("debt-owe", o);
    alert("✅ သိမ်းပြီးပါပြီ");
}

function clearDebt() {
    if (confirm("ဖျက်မှာသေချာလား?")) {
        document.getElementById("debt-receive").value = "";
        document.getElementById("debt-owe").value = "";
        localStorage.removeItem("debt-receive");
        localStorage.removeItem("debt-owe");
    }
}
function changeFontSize(size) {
    document.documentElement.style.setProperty('--app-font-size', size);
    localStorage.setItem('appFontSize', size);
  }
  // Load saved font size on app start
window.addEventListener('DOMContentLoaded', () => {
    const savedSize = localStorage.getItem('appFontSize');
    if (savedSize) {
      document.documentElement.style.setProperty('--app-font-size', savedSize);
      document.getElementById("font-size-select").value = savedSize;
    }
  });
  function showPreferredExport() {
    let data = {
        company: JSON.parse(localStorage.getItem("company") || "[]"),
        name: JSON.parse(localStorage.getItem("name") || "[]"),
        town: JSON.parse(localStorage.getItem("town") || "[]")
    };
    let jsonData = JSON.stringify(data, null, 2); // nice format
    document.getElementById("preferred-export-box").value = jsonData;
    document.getElementById("preferred-export-section").style.display = "block";
}
function restorePreferredFromText() {
    let text = document.getElementById("preferred-export-box").value;
    try {
        let data = JSON.parse(text);
        if (!Array.isArray(data.company) || !Array.isArray(data.name) || !Array.isArray(data.town)) {
            throw new Error("Invalid structure");
        }

        localStorage.setItem("company", JSON.stringify(data.company));
        localStorage.setItem("name", JSON.stringify(data.name));
        localStorage.setItem("town", JSON.stringify(data.town));
        loadPreferredNames();
        alert("Preferred names restored successfully!");
    } catch (e) {
        alert("Invalid format! Please check your pasted text.");
    }
}