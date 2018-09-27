import axios from 'axios';
import { key } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const response = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = response.data.recipe.title;
      this.author = response.data.recipe.publisher;
      this.image = response.data.recipe.image_url;
      this.url = response.data.recipe.source_url;
      this.ingredients = response.data.recipe.ingredients;

    } catch (error) {
      console.log(error);
      alert('Something went wrong 8-(');
    }
  }

  calcTime() {
    // Assuming that we need 15 minutes for eacn 3 ingredients
    const numIngredients = this.ingredients.length;
    const periods = Math.ceil(numIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const newIngredients = this.ingredients.map(ingredient => {

    });

    this.ingredients = newIngredients;
  }


}
