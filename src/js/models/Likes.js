export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img, isLiked) {
    const like = { id, title, author, img, isLiked };
    this.likes.push(like);

    // Adding data in localStorage
    this.persistData();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);

    // Adding data in localStorage
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  // Adding to localstorage
  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  // reading from storage
  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    // Restoring likes from the localStorage
    if (storage) this.likes = storage;
  }
}
