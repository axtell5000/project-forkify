import Search from './models/Search';

/* Here we are going to set a global state,
  Search object
  Current recipe object
  Shopping list object
  Liked recipe */

const state = {

};

const controlSearch = async () => {
  // Get query from view
  const query = 'pizza';

  if (query) {
    // New search object and add to state
    state.search = new Search(query);
  }

  // Search for recipes
  await state.search.getResults();

  // Render result on ui
  console.log(state.search.results);
};

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
