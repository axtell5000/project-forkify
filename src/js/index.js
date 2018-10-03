import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from "./views/base";
import '../css/styles.css';

/* Here we are going to set a global state,
  Search object
  Current recipe object
  Shopping list object
  Liked recipe

  The Controller sits between the View and Model, linking it all together, and takes care of user changes or manipulation.*/

const state = {};

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

    try {
      // Search for recipes
      await state.search.getResults();

      // Render result on ui
      clearLoader();
      searchView.renderResult(state.search.results);
    } catch (error) {
      alert('Something went wrong while searching');
      clearLoader();
    }

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

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // calculate time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );

      if (state.likes.isLiked(id)) {
        likesView.toggleLikeBtn(true);
      }

    } catch (error) {
      alert('Error occurred while processing recipe');
    }

  }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

// combining the above
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/* ----------------
  LIST CONTROLLER
  -----------------*/

const controlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and user interface
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handling delete and update list item events
elements.shopping.addEventListener('click', event => {
  const id = event.target.closest('.shopping__item').dataset.itemid;

  // handling the delete operation
  if (event.target.matches('.shopping__delete, .shopping__delete *')) {
    //Delete from the state
    state.list.deleteItem(id);

    // Delete from user interface
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const isLiked = true;
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image,
      isLiked
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

    // User HAS liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handling the recipe button clicks, not on Dom when it loads so we have to use matches()
elements.recipe.addEventListener('click', e => {
  // we also targeting any children of the match here
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {

    if (state.recipe.servings > 1) {

      // Do something when decrease button is clicked
      state.recipe.updateServings('decrease');
      recipeView.updateServingsIngredients(state.recipe);
    }

  } else if (e.target.matches('.btn-increase, .btn-increase *')) {

    // Do something when increase button is clicked
    state.recipe.updateServings('increase');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }

});


