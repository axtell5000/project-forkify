import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults () {
    const key = '58130207fcc7e71ed864a561414e5f42';
    try {
      const response = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.results = response.data.recipes;
      //console.log(this.results);
    } catch (error) {
      alert(error);
    }

  }
}
