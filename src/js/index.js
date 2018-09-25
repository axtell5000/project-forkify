import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from "./views/base";

/* Here we are going to set a global state,
  Search object
  Current recipe object
  Shopping list object
  Liked recipe */

const state = {

};

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
