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

  // Here we are trying to normalize data so its consistent throughout so we can use it elsewhere
  parseIngredients() {

    // the order of these two arrays is important
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(element => {
      // Standardize units
      let ingredient = element.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });

      // Remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // Parse ingredients into count, unit and ingredient

      const arrIngr = ingredient.split(' ');

      // findIndex - find which index contains the shortened unit (uses include to help find unit )
      const unitIndex = arrIngr.findIndex(el => units.includes(el));

      let objIngr;

      if (unitIndex > -1) {
        // Found a unit
        // Ex 4 1/2 cups, arrCount  is [4, 1/2]
        // Ex 4 cups, arrCount is [4]
        const arrCount = arrIngr.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIngr[0].replace('-', '+'));
        } else {
          count = eval(arrIngr.slice(0, unitIndex).join('+'));
        }

        objIngr = {
          count, // same as count: count - es6
          unit: arrIngr[unitIndex],
          ingredient : arrIngr.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIngr[0], 10)) {
        // There is NO unit, but first element is a number
        // eg 1 Tomato
        objIngr = {
          count: parseInt(arrIngr[0], 10),
          unit: '',
          ingredient: arrIngr.slice(1).join(' ') // slice from and including 2 element and join into a string
          // with a space delimiter
        };
      } else if (unitIndex === -1) {
        // Didnt find a unit and NO number in first position
        objIngr = {
          count: 1,
          unit: '',
          ingredient // same as ingredient: ingredient - es6
        };
      }

      return objIngr; // in map you have to return
    });

    this.ingredients = newIngredients;
  }

  updateServings(modify) {
    //Servings
    const newServings = modify === 'decrease' ? this.servings - 1 : this.servings + 1;

    //Ingredients
    this.ingredients.forEach(ingr => {
      ingr.count = ingr.count * (newServings / this.servings);
    });

    this.servings = newServings;
  }


}
