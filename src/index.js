import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/refs';
import ImgApiService from './js/img-service';
import imgCard from'./templates/img-card.hbs';

const refs = getRefs();
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  clearImgGallary();
  imgApiService.query = e.currentTarget.elements.searchQuery.value;
  imgApiService.resetPage();

  imgApiService.fetchImg()
  .then(({hits, totalHits}) => {
    Notify.info(`Hooray! We found ${totalHits} images.`);
    appendCardMarkup(hits);
  });
}

function appendCardMarkup (data) {
  refs.imgGallery.insertAdjacentHTML('beforeend', imgCard(data));
}

function clearImgGallary() {
  refs.imgGallery.innerHTML = "";
}
