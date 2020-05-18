/* eslint-env browser */
/* global insertCard, insertNotFoundMessage, removeCards, removeFavoriteCards */

let currentJokes = [];
let radioValue = null;

const showRadioContainer = () => {
  // Hide all containers
  const radioContainers = document.querySelectorAll('.radio-container');
  radioContainers.forEach((radioContainer) => {
    // eslint-disable-next-line no-param-reassign
    radioContainer.style.display = 'none';
  });

  // Get attribute `for` from checked radio button
  const radioButtons = document.querySelectorAll('form.form .flex-row .radio-btn');
  radioButtons.forEach((radioButton) => {
    if (radioButton.value === radioValue) {
      const forAttr = radioButton.getAttribute('for');

      if (forAttr) {
        const relatedElement = document.getElementById(forAttr);
        relatedElement.style.display = 'block';

        const input = document.querySelector('.search');
        if (radioValue === '3') {
          input.setAttribute('required', '');
        } else {
          input.removeAttribute('required');
        }
      }
    }
  });
};

const getCategories = async () => {
  const result = await fetch('https://api.chucknorris.io/jokes/categories');
  return result.json();
};

const getJoke = async (radioOption, category, query) => {
  let uri;
  switch (radioOption) {
    case 1:
      uri = 'https://api.chucknorris.io/jokes/random';
      break;
    case 2:
      uri = `https://api.chucknorris.io/jokes/random?category=${category}`;
      break;
    case 3:
      uri = `https://api.chucknorris.io/jokes/search?query=${query}`;
      break;
    default:
      uri = 'https://api.chucknorris.io/jokes/random';
  }

  const res = await fetch(uri);
  const result = await res.json();

  if (result.total !== undefined) {
    currentJokes = result.result;
  } else {
    currentJokes = [result];
  }
  return result;
};

const appendCard = (joke) => {
  const cnt = document.querySelector('.left-content');
  insertCard(joke, cnt);
};

const appendNotFoundMessage = () => {
  const cnt = document.querySelector('.left-content');
  insertNotFoundMessage(cnt);
};

const renderFavoriteJokes = () => {
  // Get existing favorite jokes
  let storageJokes = localStorage.getItem('jokes');
  storageJokes = storageJokes && JSON.parse(storageJokes);
  const cnt = document.querySelector('.right-block');

  if (storageJokes) {
    storageJokes.forEach((joke) => insertCard(joke, cnt, true));
  }
};


window.onload = async () => {
  const radioButtons = document.querySelectorAll('form.form .flex-row .radio-btn');

  // Init `radioValue`
  radioValue = document.querySelector('form.form .flex-row .radio-btn:checked').value;

  // Listen radio buttons change event
  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', (event) => {
      if (event.target.checked) {
        radioValue = event.target.value;
        showRadioContainer();
      }
    });
    radioButton.dispatchEvent(new Event('change'));
  });

  renderFavoriteJokes();

  // EventListener for open and close
  const sideBar = document.querySelector('.side-bar');
  const openSideBar = document.querySelector('.open-side-bar');
  const body = document.querySelector('body');
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024) {
      sideBar.style.display = 'none';
    } else {
      sideBar.style.display = 'block';
    }
  });

  if (window.innerWidth <= 1024) {
    sideBar.style.display = 'none';
  } else {
    sideBar.style.display = 'block';
  }

  openSideBar.addEventListener('click', () => {
    if (sideBar.style.display === 'none') {
      sideBar.style.display = 'block';
    }
  });

  const closeSideBar = document.querySelector('.close-side-bar');
  closeSideBar.addEventListener('click', () => {
    if (sideBar.style.display === 'block') {
      body.style.overflow = 'auto';
      sideBar.style.display = 'none';
    }
  });


  // Event listener for form

  const getForm = document.querySelector('.form');
  getForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const selectedCategory = document.querySelector('.btn-active').innerHTML.toLowerCase();
    const query = document.querySelector('.search').value;

    removeCards();
    const joke = await getJoke(Number(radioValue), selectedCategory, query);
    if (Array.isArray(joke.result)) {
      if (joke.result.length === 0) {
        appendNotFoundMessage();
      }
      if (joke.result.length) {
        joke.result.forEach((j) => {
          appendCard(j);
        });
      }
    } else {
      appendCard(joke);
    }

    let storageJokes = localStorage.getItem('jokes');
    storageJokes = storageJokes && JSON.parse(storageJokes);

    if (currentJokes) {
      currentJokes.forEach((j) => {
        if (storageJokes.some((i) => i.id === j.id)) {
          const markIcon = document.getElementById(j.id);
          markIcon.innerHTML = 'favorite';
        }
      });
    }
  });


  const categories = await getCategories();
  const buttons = categories.map((category, index) => {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.innerHTML = category.toUpperCase();
    if (index === 0) {
      button.classList.add('btn-active');
    }
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const activeButton = document.querySelector('.btn-active');
      activeButton.classList.remove('btn-active');
      button.classList.add('btn-active');
    });
    return button;
  });
  const categoriesContainer = document.querySelector('#from-category');
  categoriesContainer.append(...buttons);
};
// eslint-disable-next-line no-unused-vars
const handleClick = (event, jokeId) => {
  const joke = currentJokes.find((i) => i.id === jokeId);

  // Get existing favorite jokes
  let storageJokes = localStorage.getItem('jokes');
  storageJokes = storageJokes && JSON.parse(storageJokes);

  if (!storageJokes) {
    storageJokes = [];
  }

  const markIcon = document.getElementById(jokeId);

  // If localStorage jokes doesn't already have selected joke
  if (!storageJokes.some((i) => i.id === jokeId) && joke) {
    // Push selected joke to array
    storageJokes.push(joke);

    // Write favorite jokes to localStorage
    localStorage.setItem('jokes', JSON.stringify(storageJokes));

    // Mark current card as favorite
    if (markIcon) {
      markIcon.innerHTML = 'favorite';
    }

    // Render favorite joke
    const cnt = document.querySelector('.right-block');
    insertCard(joke, cnt, true);
  } else {
    const newJokes = storageJokes.filter((item) => item.id !== jokeId);
    localStorage.setItem('jokes', JSON.stringify(newJokes));

    // Unmark current card as favorite
    if (markIcon) {
      markIcon.innerHTML = 'favorite_border';
    }

    removeFavoriteCards();
    renderFavoriteJokes();
  }
};
