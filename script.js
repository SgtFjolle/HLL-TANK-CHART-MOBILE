// DOM references
const categorySelect = document.getElementById('category-select');
categorySelect.addEventListener('change', () => {
  fromMapBlock = false;
  updateVariations();
});

const variationButtons = document.getElementById('variation-buttons');
const armyImage = document.getElementById('army-image');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const modeToggle = document.getElementById('mode-toggle');
const mapSelect = document.getElementById('map-dropdown');
const mapResult = document.getElementById('map-result');

// Internal state
let currentCategory = 'german';
let currentVariation = '';
let fromMapBlock = false;

// Image data (faction variations)
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
  "Soviet Armed Forces": "soviet.jpg",
  "Soviet Winter Camo – Coming in Patch 17.1": null
},
  british: {
    "British Army": "british.jpg",
    "British Eighth Army": "british_eighth.jpg"
  }
};

// Map-to-faction logic
const mapData = {
  "Carentan": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } },
  "Driel": { allies: { category: 'british', variation: 'British Army' }, axis: { category: 'german', variation: 'German Army' } },
  "El Alamein": { allies: { category: 'british', variation: 'British Eighth Army' }, axis: { category: 'german', variation: 'German Africa Corps' } },
  "Elsenborn Ridge": { allies: { category: 'us', variation: 'United States Army Winter Camo' }, axis: { category: 'german', variation: 'German Army Winter Camo' } },
  "Foy": { allies: { category: 'us', variation: 'United States Army Winter Camo' }, axis: { category: 'german', variation: 'German Army Winter Camo' } },
  "Hill 400": { allies: { category: 'us', variation: 'United States Army Winter Camo' }, axis: { category: 'german', variation: 'German Army Winter Camo' } },
  "Hürtgen Forest": { allies: { category: 'us', variation: 'United States Army Winter Camo' }, axis: { category: 'german', variation: 'German Army Winter Camo' } },
  "Kharkov": { allies: { category: 'soviet', variation: 'Soviet Armed Forces' }, axis: { category: 'german', variation: 'German Army Winter Camo' } },
  "Kursk": { allies: { category: 'soviet', variation: 'Soviet Armed Forces' }, axis: { category: 'german', variation: 'German Army' } },
  "Mortain": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } },
  "Omaha Beach": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } },
  "Purple Heart Lane": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } },
  "Remagen": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } },
  "Sainte-Marie-du-Mont": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } },
  "Sainte-Mère-Église": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } },
  "Stalingrad": { allies: { category: 'soviet', variation: 'Soviet Armed Forces' }, axis: { category: 'german', variation: 'German Army Winter Camo' } },
  "Tobruk": { allies: { category: 'british', variation: 'British Eighth Army' }, axis: { category: 'german', variation: 'German Africa Corps' } },
  "Utah Beach": { allies: { category: 'us', variation: 'United States Army' }, axis: { category: 'german', variation: 'German Army' } }
};

// Populate the dropdown
function populateCategories() {
  categorySelect.innerHTML = '';
  for (const key in imageMap) {
    const option = document.createElement('option');
    option.value = key;
    const displayNames = {
  german: "AXIS - German",
  us: "ALLIES - United States",
  soviet: "ALLIES - Soviet",
  british: "ALLIES - British"
};
option.textContent = displayNames[key] || key;
    categorySelect.appendChild(option);
  }
}

// Populate variation buttons
function updateVariations() {
  const category = categorySelect.value;
  const variations = imageMap[category];
  variationButtons.innerHTML = '';

  Object.keys(variations).forEach((variation, i) => {
    const btn = document.createElement('button');
    btn.textContent = variation;

    if (!variations[variation]) {
      btn.disabled = true;
      btn.classList.add('variation-disabled');
    } else {
      btn.onclick = () => {
        currentCategory = category;
        currentVariation = variation;
        showImage(category, variation);
        [...variationButtons.children].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
    }

    variationButtons.appendChild(btn);

    // Auto-select first valid variation if not from map
    if (!fromMapBlock && i === 0 && variations[variation]) {
      btn.click();
    }
  });

  fromMapBlock = false;
}

// Show the selected image
function showImage(category, variation) {
  armyImage.classList.remove('visible');
  armyImage.src = imageMap[category][variation];
  armyImage.alt = variation;
  setTimeout(() => {
    armyImage.classList.add('visible');
  }, 100);
}

// Toggle theme
function toggleMode() {
  const light = document.body.classList.toggle('light-mode');
  modeToggle.textContent = light ? '☀️' : '🌙';
}

// Toggle fullscreen mode
function enterFullscreen() {
  const imageBlock = document.querySelector('.image-block');
  if (imageBlock.requestFullscreen) {
    imageBlock.requestFullscreen();
  } else if (imageBlock.webkitRequestFullscreen) {
    imageBlock.webkitRequestFullscreen();
  } else if (imageBlock.msRequestFullscreen) {
    imageBlock.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
  } else if (document.msFullscreenElement) {
    document.msExitFullscreen();
  }
}

// Populate map dropdown and handle interaction
function populateMapSelector() {
  // Add placeholder as first option
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '- Choose a map -';
  placeholder.disabled = true;
  placeholder.selected = true;
  mapSelect.appendChild(placeholder);

  // Add all map options
  for (const map in mapData) {
    const opt = document.createElement('option');
    opt.value = map;
    opt.textContent = map;
    mapSelect.appendChild(opt);
  }

  // Handle selection
  mapSelect.addEventListener('change', () => {
    const selectedMap = mapSelect.value;
    const data = mapData[selectedMap];
    if (!data) {
      mapResult.innerHTML = '';
      return;
    }

    mapResult.innerHTML = `
      <p>This map is played by:</p>
      <div class="map-line">
        <span>ALLIES:</span>
        <button class="map-answer" data-cat="${data.allies.category}" data-var="${data.allies.variation}">${data.allies.variation}</button>
      </div>
      <div class="map-line">
        <span>AXIS:</span>
        <button class="map-answer" data-cat="${data.axis.category}" data-var="${data.axis.variation}">${data.axis.variation}</button>
      </div>
    `;

    document.querySelectorAll('.map-answer').forEach(btn => {
      btn.addEventListener('click', () => {
        categorySelect.value = btn.dataset.cat;
        fromMapBlock = true;
        updateVariations();
        [...variationButtons.children].forEach(vb => {
          if (vb.textContent === btn.dataset.var) vb.click();
        });
      });
    });
  });
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  categorySelect.value = 'german';
  updateVariations();
  populateMapSelector();
});

// Fade in body
window.onload = () => {
  document.body.classList.add('loaded');
};


