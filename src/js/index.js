import Search from './models/Search';
import Recipe from './models/Recipe'
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from "./views/base";

/* Here we are going to set a global state,
  Search object
  Current recipe object
  Shopping list object
  Liked recipe */

const state = {

};

// SEARCH CONTROLLER
// --------------------

const controlSearch = async () => {
  // Get query from view
  const query = searchView.getInput();

  if (query) {
    // New search object and add to state
    state.search = new Search(query);

    // Prepare ui for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    // Search for recipes
    await state.search.getResults();

    // Render result on ui
    clearLoader();
    searchView.renderResult(state.search.results);
  }


};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResult(state.search.results, goToPage);

  }
});

// RECIPE CONTROLLER
//-----------------------

const r = new Recipe(46956);
r.getRecipe();
console.log(r);
