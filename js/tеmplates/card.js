/* eslint-env browser */
/* global timeSince */

/**
 * Creates HTML text template for card.
 * @param {Object} joke - joke to display
 * @returns {string} - HTML text template
 */

const createCard = (joke, isFavorite) => {
  const since = timeSince(new Date(joke.updated_at));

  return (
    `<div class="${isFavorite ? 'right-cards' : 'card'}">
  <div class="card-actions-cnt"> 
    <span id="${isFavorite ? `${joke.id}-favorite` : joke.id}" class="material-icons icon-favourite" onclick="handleClick(event, '${joke.id}')">${isFavorite ? 'favorite' : 'favorite_border'}</span> 
  </div> 
  <div class="card-content"> 
    <div class="side-card-content"> 
      <div class="icon-cnt ${isFavorite ? 'grey' : 'white'}"> 
        <span class="material-icons icon-message">message</span> 
      </div> 
    </div> 
    <div class="main-card-content"> 
      <div class="card-link-cnt"> 
        <span class="id text-color">ID:</span> <a class="id" href="${joke.url}">${joke.id}</a> 
        <span class="material-icons link-icon"> open_in_new</span> 
      </div> 
      <p style="word-break: break-word;">${joke.value}</p> 
      <div class="card-info-cnt"> 
        <p class="last-update">Last update: ${since} ago</p> 
        <label class="joke-categories" ${joke.categories && joke.categories.length > 0 ? '' : "style='display: none;'"} ${isFavorite ? "style = 'display: none;'" : ''}>${joke.categories}</label>
      </div> 
    </div> 
  </div> 
</div>`
  );
};

/**
 * Creates node with not found message.
 * @returns {HTMLElement} - node with not found message
 */

const createNotFoundMessageNode = () => {
  const div = document.createElement('div');
  div.classList.add('card');
  const h2 = document.createElement('h2');
  h2.style = 'text-align: center;';
  h2.innerHTML = 'Jokes Not Found';
  div.appendChild(h2);
  return div;
};

/**
 * Inserts card to a target node.
 * @param {Object} joke - joke to display
 * @param {HTMLElement} targetNode - node to insert
 * @param {Boolean} isFavorite - is card marked as favorite
 */

// eslint-disable-next-line no-unused-vars
const insertCard = (joke, targetNode, isFavorite) => {
  targetNode.insertAdjacentHTML('beforeend', createCard(joke, isFavorite));
};

/**
 * Inserts not found message to a target node.
 * @param {HTMLElement} targetNode - node to insert
 */

// eslint-disable-next-line no-unused-vars
const insertNotFoundMessage = (targetNode) => {
  targetNode.appendChild(createNotFoundMessageNode());
};

/**
 * Removes cards with result
 */

// eslint-disable-next-line no-unused-vars
const removeCards = () => {
  const leftContent = document.querySelector('.left-content');
  while (leftContent.lastChild.classList && leftContent.lastChild.classList.contains('card')) {
    leftContent.removeChild(leftContent.lastChild);
  }
};

/**
 * Removes favorite cards with result
 */

// eslint-disable-next-line no-unused-vars
const removeFavoriteCards = () => {
  const rightBlock = document.querySelector('.right-block');
  while (rightBlock.lastChild.classList && rightBlock.lastChild.classList.contains('right-cards')) {
    rightBlock.removeChild(rightBlock.lastChild);
  }
};
