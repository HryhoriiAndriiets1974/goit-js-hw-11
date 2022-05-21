import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/refs';
import ImgApiService from './js/img-service';
import imgCard from'./templates/img-card.hbs';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

// var lightbox = new SimpleLightbox('.gallery a', { /* options */ });
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
  captionDelay: 1000,
});

let stopScroll = true;
const refs = getRefs();
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onScroll);
refs.upBtn.addEventListener('click', onUpBtn);
window.addEventListener('scroll', infinitiScroll);

function onSearch(e) {
  e.preventDefault();
  clearImgGallary();
  stopScroll = true;
  imgApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imgApiService.resetPage();

  if (!imgApiService.query) {
    return Notify.warning('Sorry, there are no images matching your search query. Please try again.')
  }

  imgApiService.fetchImg()
  .then(({hits, totalHits}) => {
    if (totalHits === 0) {
      return Notify.warning('Sorry, there are no images matching your search query. Please try again.')
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);
    appendCardMarkup(hits);
    lightbox.refresh();
    // smoothlyScroll();
  });
}

function onScroll(e) {
  imgApiService.fetchImg()
    .then(({hits}) => {

      if (imgApiService.page > 13) {
        stopScroll = false;
        return Notify.warning("We're sorry, but you've reached the end of search results.");
      }

      if (hits.length < 40) {
        Notify.warning("We're sorry, but you've reached the end of search results.");
       }
    refs.upBtn.classList.remove('js-hidden');
    appendCardMarkup(hits);
    lightbox.refresh();
    smoothlyScroll();
    })
}

function appendCardMarkup (data) {
  refs.imgGallery.insertAdjacentHTML('beforeend', imgCard(data));
}

function clearImgGallary() {
  refs.imgGallery.innerHTML = "";
  refs.upBtn.classList.add('js-hidden');
}

function smoothlyScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
};

function infinitiScroll() {
    console.log(window.scrollY + window.innerHeight +1 - document.documentElement.scrollHeight);
  if(window.scrollY + window.innerHeight + 1 >=
  document.documentElement.scrollHeight && stopScroll) {
    onScroll();
  }};

function onUpBtn() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(onUpBtn, 0);
  }
}
