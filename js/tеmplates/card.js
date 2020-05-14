/**
 * Creates HTML text template.
 * @param {Object} joke - joke to display
 * @returns {string} - HTML text remplate
 */

const createCard = (joke, isFavorite) => {
        const since = timeSince(new Date(joke.updated_at));

        return (
                `<div class="${isFavorite ? "rightCards" : "card"}">
  <div class="cardActionsCnt"> 
    <span id="${isFavorite ? `${joke.id}-favorite` : joke.id}" class="material-icons iconFavourite" onclick="handleClick(event, '${joke.id}')">${isFavorite ? "favorite" : "favorite_border"}</span> 
  </div> 
  <div class="cardContent"> 
    <div class="sideCardContent"> 
      <div class="iconCnt ${isFavorite ? "grey" : "white"}"> 
        <span class="material-icons iconMessage">message</span> 
      </div> 
    </div> 
    <div class="mainCardContent"> 
      <div class="cardLinkCnt"> 
        <span class="id textColor">ID:</span> <a class="id" href="${joke.url}">${joke.id}</a> 
        <span class="material-icons linkIcon"> open_in_new</span> 
      </div> 
      <p>${joke.value}</p> 
      <div class="cardInfoCnt"> 
        <p class="lastUpdate">Last update: ${since} ago</p> 
        <label class="jokeCategories" ${joke.categories && joke.categories.length > 0 ? "" : "style='display: none;'"} ${isFavorite ? "style = 'display: none;'" : ""}>${joke.categories}</label>
      </div> 
    </div> 
  </div> 
</div>`
  );
};

/**
 * Inserts card to a target node.
 * @param {Object} joke - joke to display
 * @param {HTMLElement} targetNode - node to insert
 * @param {Boolean} isFavorite - is card marked as favorite
 */

const insertCard = (joke, targetNode, isFavorite) => {
  targetNode.insertAdjacentHTML('beforeend', createCard(joke, isFavorite));
};

/**
 * Removes cards with result
 */

const removeCards = () => {
  const gr17 = document.querySelector('.leftContent');
  while (gr17.lastChild.classList && gr17.lastChild.classList.contains('card')) {
    gr17.removeChild(gr17.lastChild);
  }
};

/**
 * Removes favorite cards with result
 */

const removeFavoriteCards = () => {
  const rightBlock = document.querySelector('.rightBlock');
  while (rightBlock.lastChild.classList && rightBlock.lastChild.classList.contains('rightCards')) {
    rightBlock.removeChild(rightBlock.lastChild);
  }
};