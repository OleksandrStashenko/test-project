let currentJokes = [];
let radioValue = null;

const showRadioContainer = () => {
    // Hide all containers
    const radioContaiers = document.querySelectorAll('.radioContainer')
    radioContaiers.forEach(radioContaier => {
        radioContaier.style.display = 'none'
    })

    // Get attribute `for` from checked radio button
    const radioButtons = document.querySelectorAll('form.form .flexRow .radioBtn')
    radioButtons.forEach(radioButton => {
        if (radioButton.value === radioValue) {
            const forAttr = radioButton.getAttribute('for')

            if (forAttr) {
                const relatedElement = document.getElementById(forAttr)
                relatedElement.style.display = 'block'

                const input = document.querySelector('.search')
                if (radioValue === '3') {
                    input.setAttribute('required', '')
                } else {
                    input.removeAttribute('required')
                }
            }
        }
    })

}

const getCategories = async() => {
    const result = await fetch('https://api.chucknorris.io/jokes/categories');
    return result.json();
};

const getRandomJoke = async() => {
    const result = await fetch('https://api.chucknorris.io/jokes/random');
    return result.json();
};

const getJokeFromCategory = async(category) => {
    const result = await fetch(`https://api.chucknorris.io/jokes/random?category={${category}}`);
    return result.json();
};

const getJoke = async(radioOption, category, query) => {
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
        currentJokes = result.result
    } else {
        currentJokes = [result]
    }
    return result;
};

const appendCard = joke => {
    const cnt = document.querySelector('.leftContent');
    insertCard(joke, cnt);
}

const renderFavoriteJokes = () => {
    // Get existing favorite jokes
    let storageJokes = localStorage.getItem('jokes');
    storageJokes = storageJokes && JSON.parse(storageJokes);
    const cnt = document.querySelector('.rightBlock');

    storageJokes.forEach((joke) => insertCard(joke, cnt, true));
};


window.onload = async function() {
    const radioButtons = document.querySelectorAll('form.form .flexRow .radioBtn')

    // Init `radioValue`
    radioValue = document.querySelector('form.form .flexRow .radioBtn:checked').value

    // Listen radio buttons change event
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', function(event) {
            if (event.target.checked) {
                radioValue = this.value
                showRadioContainer()
            }
        })
        radioButton.dispatchEvent(new Event('change'))
    })

    renderFavoriteJokes();

    // EventListener for open and close
    const sideBar = document.querySelector('.sideBar')
    const openSideBar = document.querySelector('.openSideBar')
    const body = document.querySelector('body')
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 1024) {
            sideBar.style.display = 'none';
        } else {
            sideBar.style.display = 'block';
        }
    })

    if (window.innerWidth <= 1024) {
        sideBar.style.display = 'none';
    } else {
        sideBar.style.display = 'block';
    };

    openSideBar.addEventListener('click', function() {
        if (sideBar.style.display == 'none') {
            body.style.overflow = 'hidden';
            sideBar.style.display = 'block';
        }
    });

    const closeSideBar = document.querySelector('.closeSideBar')
    closeSideBar.addEventListener('click', function() {
        if (sideBar.style.display == 'block') {
            body.style.overflow = 'auto';
            sideBar.style.display = 'none';
        }
    });



    //Event listener for form

    const getForm = document.querySelector('.form');
    getForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const selectedCategory = document.querySelector('.btnActive').innerHTML.toLowerCase();
        const query = document.querySelector('.search').value;

        removeCards();
        const joke = await getJoke(Number(radioValue), selectedCategory, query);
        if (Array.isArray(joke.result)) {
            if (joke.result.length === 0) {
                console.log('empty array'); // todo
            }
            joke.result && joke.result.forEach((j) => {
                appendCard(j);
            });

        } else {
            appendCard(joke);
        }

        let storageJokes = localStorage.getItem('jokes');
        storageJokes = storageJokes && JSON.parse(storageJokes);

        currentJokes && currentJokes.forEach((j) => {
            if (storageJokes.some(i => i.id === j.id)) {
                const markIcon = document.getElementById(j.id);
                markIcon.innerHTML = 'favorite';
            }
        });
    });


    const categories = await getCategories();
    const buttons = categories.map((category, index) => {
        const button = document.createElement('button');
        button.classList.add('btn');
        button.innerHTML = category.toUpperCase();
        if (index === 0) {
            button.classList.add('btnActive');
        }
        button.addEventListener('click', (e) => {
            e.preventDefault()
            const activeButton = document.querySelector('.btnActive');
            activeButton.classList.remove('btnActive');
            button.classList.add('btnActive');
        });
        return button;
    });
    const categoriesContainer = document.querySelector('#fromCategory');
    categoriesContainer.append(...buttons);
}

const handleClick = (event, jokeId) => {
    console.log(event);
    const joke = currentJokes.find(i => i.id === jokeId)

    // Get existing favorite jokes
    let storageJokes = localStorage.getItem('jokes')
    storageJokes = storageJokes && JSON.parse(storageJokes)

    if (!storageJokes) {
        storageJokes = []
    }

    const markIcon = document.getElementById(jokeId)

    // If localStorage jokes doesn't already have selected joke
    if (!storageJokes.some(i => i.id === jokeId) && joke) {
        // Push selected joke to array
        storageJokes.push(joke)

        // Write favorite jokes to localStorage
        localStorage.setItem('jokes', JSON.stringify(storageJokes))

        //Mark current card as favorite
        if (markIcon) {
            markIcon.innerHTML = 'favorite'
        }

        // Render favorite joke
        const cnt = document.querySelector('.rightBlock');
        insertCard(joke, cnt, true);
    } else {
        const newJokes = storageJokes.filter(item => item.id !== jokeId)
        localStorage.setItem('jokes', JSON.stringify(newJokes))

        //Unmark current card as favorite
        if (markIcon) {
            markIcon.innerHTML = 'favorite_border'
        }

        removeFavoriteCards()
        renderFavoriteJokes()
    }

}