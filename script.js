const input = document.querySelector('#inputRepo');
const formSelect = document.querySelector('#selectRepo');
const cardsContainer = document.querySelector('#cards-container');

async function getGitRepos(searchQuery) {
  const url = `https://api.github.com/search/repositories?q=${searchQuery}`;

  let response = await fetch(url);
  let data = await response.json()
    
  return data.items
}

function debounce(fn, debounceTime) {
  let timeout;
  return function (...args) {    
      
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn.call(this, ...args)
    }, debounceTime)
  }
};

const debouncedInputHandler = debounce(inputHandler, 300);

input.addEventListener('input', debouncedInputHandler)


function inputHandler(e) {
  const searchQuery = input.value; 
  const firstFiveRepos = [];

  if (!input.value) {
    closeSelect();
    clearSelect();

    return
  }
  getGitRepos(searchQuery).then(arr => {

    if (arr.length != 0) {

      arr.forEach((repo, i) => {
        if (i >= 5) return
  
        firstFiveRepos.push(repo);
  
      });

      renderSelect(firstFiveRepos)
    } else {
      closeSelect();
      clearSelect();
    }

  })
  
}

function renderSelect(repos) {
  clearSelect();
  const fragment = document.createDocumentFragment();


  repos.forEach((repo, i) => {
    const option = document.createElement('option')
    option.textContent = repo.name;

    option.addEventListener('click', (e) => {
      optionClickHandler(repos, e.currentTarget)
    })

    fragment.append(option)

  });

  formSelect.append(fragment);
  if (!formSelect.classList.contains('form-select--show')) {
    formSelect.classList.add('form-select--show')
    input.classList.add('form-control--active')
  }
  openSelect()
}

function optionClickHandler(repos, currentSelect) {
  closeSelect()

  repos.forEach(item => {
    if (item.name == currentSelect.textContent) {
      renderCard(item)
      input.value = '';
    }
  })
}

function renderCard(repo) {
  let card = `
  <div class="card">
    <div class="card-body">
      <p><span>Name: </span>${repo.name}</p>
      <p><span>Owner: </span>${repo.owner.login}</p>
      <p><span>Stars: </span>${repo.stargazers_count}</p>
    </div>
    <button class="delete-card"></button>
  </div>`;

  cardsContainer.insertAdjacentHTML('afterbegin', card)

  cardsContainer.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('delete-card')) {
      e.target.parentElement.remove()
    }
  })
}



function clearSelect() {
  formSelect.querySelectorAll('option').forEach(item => {
    item.remove()
  })
}
function openSelect() {
  formSelect.size = formSelect.length
}
function closeSelect() {
  formSelect.classList.remove('form-select--show')
  input.classList.remove('form-control--active')
  formSelect.size = 1
}