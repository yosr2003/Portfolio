/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*===== ACTIVE AND REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav_link');   

function linkAction(){
  /*Active link*/
  navLink.forEach(n => n.classList.remove('active'));
  this.classList.add('active');
  
  /*Remove menu mobile*/
  const navMenu = document.getElementById('nav-menu')
  navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2000,
    reset: true
});

/*SCROLL HOME*/
sr.reveal('.home_title',{}); 
sr.reveal('.button',{delay: 200}); 
sr.reveal('.home_img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 

/*SCROLL ABOUT*/
sr.reveal('.about_img',{}); 
sr.reveal('.about_subtitle',{delay: 400}); 
sr.reveal('.about_text',{delay: 400}); 

/*SCROLL SKILLS*/
sr.reveal('.skills_subtitle',{}); 
sr.reveal('.skills_text',{}); 
sr.reveal('.skills_data',{interval: 200}); 
sr.reveal('.skills_img',{delay: 600});

/*SCROLL WORK*/
sr.reveal('.work_img',{interval: 200}); 

/*SCROLL CONTACT*/
sr.reveal('.contact_input',{interval: 200}); 








/*   API    */

// Function to fetch and populate dropdown options based on search type
async function populateOptions(searchType) {
    const searchOptions = document.getElementById('rick-morty-searchOptions');
    searchOptions.innerHTML = ''; // Clear previous options

    // Function to fetch all pages of data
    async function fetchAllPages(url) {
        let allResults = [];
        let nextPage = url;

        while (nextPage) {
            const response = await fetch(nextPage);
            const data = await response.json();
            const { results, info } = data;
            allResults.push(...results);
            nextPage = info.next;
        }

        return allResults;
    }

    // Perform the API request based on the selected search type
    const apiUrl = `https://rickandmortyapi.com/api/${searchType}`;
    const allData = await fetchAllPages(apiUrl);

    if (allData.length > 0) {
        if (searchType === 'episode') {
            // Sort episodes by season and episode number
            const sortedEpisodes = allData.sort((a, b) => {
                
                const [aSeason, aEpisode] = a.episode.split('E');
                const [bSeason, bEpisode] = b.episode.split('E');
                if (aSeason !== bSeason) {
                    return aSeason.localeCompare(bSeason);
                }
                return parseInt(aEpisode) - parseInt(bEpisode);
            });

            let currentSeason = '';
            sortedEpisodes.forEach(episode => {
                const [season, episodeNumber] = episode.episode.split('E');
                if (season !== currentSeason) {
                    const seasonOption = document.createElement('optgroup');
                    seasonOption.label = `Season ${season}`;
                    searchOptions.appendChild(seasonOption);
                    currentSeason = season;
                }
                const option = document.createElement('option');
                option.value = episode.id;
                option.text = `Episode ${episodeNumber} - ${episode.name}`;
                searchOptions.lastElementChild.appendChild(option);
            });
        } else {
            allData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.name || item.dimension;
                searchOptions.appendChild(option);
            });
        }
    } else {
        const option = document.createElement('option');
        option.disabled = true;
        option.text = 'No options available.';
        searchOptions.appendChild(option);
    }
}

// Function to handle the search based on selected search type and option
function rickMortySearch() {
    const searchType = document.getElementById('rick-morty-searchType').value;
    const searchOptions = document.getElementById('rick-morty-searchOptions');
    const selectedOption = searchOptions.options[searchOptions.selectedIndex].value;
    const searchResult = document.getElementById('rick-morty-searchResult');
    searchResult.innerHTML = ''; // Clear previous results

    // Perform the API request based on the selected search type and option
    fetch(`https://rickandmortyapi.com/api/${searchType}/${selectedOption}`)
        .then(response => response.json())
        .then(data => {
            const resultInfo = document.createElement('div');
            resultInfo.classList.add('animated', 'fadeIn'); // Add animation class

            if (searchType === 'character') {
                resultInfo.innerHTML = `<h2>${data.name}</h2>
                                        <div class="character-info">
                                            <img src="${data.image}" alt="${data.name}" class="character-image" />
                                            <div>
                                                <p>Status: ${data.status}</p>
                                                <p>Species: ${data.species}</p>
                                                <p>Gender: ${data.gender}</p>
                                                <p>Origin: ${data.origin.name}</p>
                                                <p>Location: ${data.location.name}</p>
                                            </div>
                                        </div>`;
            } else if (searchType === 'episode') {
                resultInfo.innerHTML = `<h2>${data.name}</h2>
                                        <p>Episode: ${data.episode}</p>
                                        <p>Air Date: ${data.air_date}</p>`;
            } else if (searchType === 'location') {
                resultInfo.innerHTML = `<h2>${data.name}</h2>
                                        <p>Type: ${data.type}</p>
                                        <p>Dimension: ${data.dimension}</p>`;
            }
            searchResult.appendChild(resultInfo);
        })
        .catch(error => {
            console.error(error);
            searchResult.textContent = 'An error occurred while fetching data.';
        });
}

// Event listener to populate options when search type changes
document.getElementById('rick-morty-searchType').addEventListener('change', function() {
    const searchType = this.value;
    populateOptions(searchType);
});

// Initial population of options based on default search type
populateOptions('character');
