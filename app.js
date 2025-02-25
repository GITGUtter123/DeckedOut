let flashcards = [];
let currentCardIndex = 0;
let presets = JSON.parse(localStorage.getItem('flashcardPresets')) || [];
const carousel = document.querySelector('.carousel');

// Flip card on click
document.addEventListener('click', (e) => {
  if (e.target.closest('.main')) {
    e.target.closest('.main').classList.toggle('flipped');
  }
});

// Toggle dropdown visibility
function toggleDropdown() {
  const dropdown = document.getElementById('presetDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Save preset function
function savePreset() {
  const presetName = prompt('Enter a name for the preset:');
  if (presetName) {
    presets.push({ name: presetName, cards: [...flashcards] });
    localStorage.setItem('flashcardPresets', JSON.stringify(presets));
    updatePresetList();
  }
}

// Update the preset list in the dropdown
function updatePresetList() {
  const presetList = document.getElementById('presetList');
  presetList.innerHTML = '';
  presets.forEach((preset, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = preset.name;

    // Create a delete button for each preset
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.onclick = (e) => {
      e.stopPropagation(); // Prevent the click event from firing for loading the preset
      deletePreset(index);
    };

    listItem.appendChild(deleteButton);
    listItem.onclick = () => loadPreset(index);
    presetList.appendChild(listItem);
  });
}

updatePresetList()

// Delete a preset
function deletePreset(index) {
  if (confirm('Are you sure you want to delete this preset?')) {
    presets.splice(index, 1); // Remove the preset from the list
    localStorage.setItem('flashcardPresets', JSON.stringify(presets)); // Save the updated presets to localStorage
    updatePresetList(); // Update the dropdown list
  }
}

// Load selected preset
function loadPreset(index) {
  flashcards = [...presets[index].cards];
  shuffleFlashcards();
  loadCard(document.querySelector('.main'), 0);
  toggleDropdown(); // Hide dropdown after selection
}

// Shuffle flashcards randomly
function shuffleFlashcards() {
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
}

// Load a flashcard into a given card element
function loadCard(element, index) {
  if (flashcards.length > 0) {
    const front = element.querySelector('.front');
    const back = element.querySelector('.back');

    // Ensure front and back are found before setting textContent
    if (front && back) {
      front.textContent = flashcards[index].question;
      back.textContent = flashcards[index].answer;
      element.classList.remove('flipped');
    } else {
      console.error("Error: front/back elements not found for card.");
    }
  }
}

// Move to the next flashcard with rotation effect
function nextCard() {
  if (flashcards.length < 2) return; // Ensure there are at least 2 cards for rotation

  // Calculate the new index for the next card
  let newIndex = (currentCardIndex + 1) % flashcards.length;

  const mainCard = document.querySelector('.main');
  const leftGhost = document.querySelector('.left');
  const rightGhost = document.querySelector('.right');

  // Animate current card moving left (turn into left ghost)
  mainCard.classList.add('left');
  mainCard.classList.remove('main');

  // Animate right ghost becoming the main card
  rightGhost.classList.add('main');
  rightGhost.classList.remove('right');

  // Remove the old left ghost card before adding the new one
  if (leftGhost) {
    leftGhost.remove();
  }

  // Create a new right ghost card
  const newRightGhost = document.createElement('div');
  newRightGhost.classList.add('flashcard', 'right');
  newRightGhost.innerHTML = `<div class="card-face front"></div><div class="card-face back"></div>`;

  // Load new card data for the new ghost
  let nextIndex = (newIndex + 1) % flashcards.length;
  loadCard(newRightGhost, nextIndex); // This ensures the text is loaded before appending

  // Append the new right ghost to the carousel
  carousel.appendChild(newRightGhost);

  // Update current card index
  currentCardIndex = newIndex;
}

// Handle flashcard form submission
document.getElementById('flashcard-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const question = document.getElementById('question').value.trim();
  const answer = document.getElementById('answer').value.trim();

  if (question && answer) {
    flashcards.push({ question, answer });
    shuffleFlashcards();
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';

    if (flashcards.length === 1) {
      loadCard(document.querySelector('.main'), 0);
    }
  }
});

// Clear all flashcards
function clearAllFlashcards() {
  flashcards = [];
  currentCardIndex = 0;
  document.querySelector('.main').innerHTML = '<div class="card-face front"></div><div class="card-face back"></div>';
}

// Clear all button event
document.querySelector('.clear-btn').addEventListener('click', clearAllFlashcards);

// Add default 20 flashcards
function addDefaultFlashcards() {
  const defaultFlashcards = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the largest planet?", answer: "Jupiter" },
    { question: "Who wrote '1984'?", answer: "George Orwell" },
    { question: "What is the fastest land animal?", answer: "Cheetah" },
    { question: "What is the boiling point of water?", answer: "100°C" },
    { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
    { question: "What is the largest ocean?", answer: "Pacific Ocean" },
    { question: "What is the smallest country?", answer: "Vatican City" },
    { question: "What is the longest river?", answer: "Nile River" },
    { question: "What is the capital of Japan?", answer: "Tokyo" },
    { question: "What is the currency of the USA?", answer: "Dollar" },
    { question: "What is the largest desert?", answer: "Sahara Desert" },
    { question: "What is the hardest substance?", answer: "Diamond" },
    { question: "What is the square root of 16?", answer: "4" },
    { question: "Who discovered penicillin?", answer: "Alexander Fleming" },
    { question: "What is the largest animal?", answer: "Blue Whale" },
    { question: "What is the capital of India?", answer: "New Delhi" },
    { question: "What is the tallest mountain?", answer: "Mount Everest" },
    { question: "Who developed the theory of relativity?", answer: "Albert Einstein" },
  ];

  flashcards = [...flashcards, ...defaultFlashcards];
  shuffleFlashcards();

  // Load the first card after adding defaults
  loadCard(document.querySelector('.main'), currentCardIndex);
}

addDefaultFlashcards();
