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
  british: {
    "British Army": "british.jpg",
    "British Eighth Army": "british_eighth.jpg"
  },
  soviet: {
    "Soviet": "soviet.jpg"
  }
};

const mapInfo = {
  "Stalingrad": ["Soviet", "German Army Winter Camo"],
  "Kursk": ["Soviet", "German Army Winter Camo"],
  "Kharkov": ["Soviet", "German Army Winter Camo"],
  "Carentan": ["US", "German Army"],
  "Utah Beach": ["US", "German Army"],
  "Omaha Beach": ["US", "German Army"],
  "El Alamein": ["British Eighth Army", "German Africa Corps"],
  // Add other maps as needed
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
  armyImage.src = Object.values(variations)[0];
}

function toggleMode() {
  document.body.classList.toggle("dark");
}

function enterFullscreen() {
  const src = armyImage.src;
  fullscreenImage.src = src;
  fullscreenOverlay.classList.add("active");
  document.documentElement.requestFullscreen();
}

function exitFullscreen() {
  fullscreenOverlay.classList.remove("active");
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
            categorySelect.value = key;
            updateVariations();
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
