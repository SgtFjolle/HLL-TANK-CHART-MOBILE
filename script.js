const categorySelect = document.getElementById("category-select");
const variationButtons = document.getElementById("variation-buttons");
const armyImage = document.getElementById("army-image");
const fullscreenToggle = document.getElementById("fullscreen-toggle");
const fullscreenOverlay = document.getElementById("fullscreen-overlay");
const fullscreenImage = document.getElementById("fullscreen-image");
const mapDropdown = document.getElementById("map-dropdown");
const mapResult = document.getElementById("map-result");

const imageMap = {
  german: {
    "German Army": "german.jpg",
    "German Army Winter Camo": "german_winter.jpg",
    "German Africa Corps": "german_africa.jpg"
  },
  us: {
    "United States Army": "us.jpg",
    "United States Army Winter Camo": "us_winter.jpg"
  },
  soviet: {
    "Soviet Armed Forces": "soviet.jpg"
  },
  british: {
    "British Army": "british.jpg",
    "British Eighth Army": "british_eighth.jpg"
  }
};

const mapInfo = {
  "Stalingrad": ["Soviet Armed Forces", "German Army Winter Camo"],
  "Kursk": ["Soviet Armed Forces", "German Army Winter Camo"],
  "Kharkov": ["Soviet Armed Forces", "German Army Winter Camo"],
  "Carentan": ["United States Army", "German Army"],
  "Utah Beach": ["United States Army", "German Army"],
  "Omaha Beach": ["United States Army", "German Army"],
  "Foy": ["United States Army Winter Camo", "German Army Winter Camo"],
  "Hurtgen Forest": ["United States Army Winter Camo", "German Army Winter Camo"],
  "Purple Heart Lane": ["United States Army", "German Army"],
  "Sainte-Mère-Église": ["United States Army", "German Army"],
  "Hill 400": ["United States Army Winter Camo", "German Army Winter Camo"],
  "Remagen": ["United States Army", "German Army"],
  "El Alamein": ["British Eighth Army", "German Africa Corps"],
  "Sainte-Marie-du-Mont": ["United States Army", "German Army"],
  "Driel": ["British Army", "German Army"],
  "St. Marie du Mont": ["United States Army", "German Army"],
  "Hill 93": ["Soviet Armed Forces", "German Army"],
  "Kherson": ["Soviet Armed Forces", "German Army Winter Camo"]
};

function populateCategories() {
  for (const faction in imageMap) {
    const option = document.createElement("option");
    option.value = faction;
    option.textContent = faction.toUpperCase();
    categorySelect.appendChild(option);
  }
}

function updateVariations() {
  variationButtons.innerHTML = "";

  const selectedFaction = categorySelect.value;
  const variations = imageMap[selectedFaction];

  for (const variation in variations) {
    const btn = document.createElement("button");
    btn.textContent = variation;
    btn.onclick = () => {
      armyImage.src = variations[variation];
    };
    variationButtons.appendChild(btn);
  }

  // ✅ Automatically select the first variation
  const firstBtn = variationButtons.querySelector("button");
  if (firstBtn) firstBtn.click();
}

function toggleMode() {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  document.getElementById("mode-toggle").textContent = isLight ? "☀️" : "🌙";
}

function enterFullscreen() {
  fullscreenImage.src = armyImage.src;
  fullscreenOverlay.classList.add("active");
  document.documentElement.requestFullscreen();
  fullscreenToggle.style.display = "none";
}

function exitFullscreen() {
  fullscreenOverlay.classList.remove("active");
  fullscreenToggle.style.display = "inline-block";
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

function populateMapDropdown() {
  for (const map in mapInfo) {
    const option = document.createElement("option");
    option.value = map;
    option.textContent = map;
    mapDropdown.appendChild(option);
  }
}

mapDropdown.addEventListener("change", () => {
  const selectedMap = mapDropdown.value;
  const [allies, axis] = mapInfo[selectedMap] || [];

  if (allies && axis) {
    mapResult.innerHTML = `On this map <span class="clickable">${allies}</span> is playing against <span class="clickable">${axis}</span>.`;

    mapResult.querySelectorAll(".clickable").forEach(el => {
      el.onclick = () => {
        for (const key in imageMap) {
          if (imageMap[key][el.textContent]) {
            // ✅ Set correct faction
            categorySelect.value = key;

            // ✅ Load and show variation buttons
            updateVariations();

            // ✅ Auto-click exact variation match
            [...variationButtons.children].forEach(btn => {
              if (btn.textContent === el.textContent) btn.click();
            });
          }
        }
      };
    });
  }
});

populateCategories();
updateVariations();
populateMapDropdown();

