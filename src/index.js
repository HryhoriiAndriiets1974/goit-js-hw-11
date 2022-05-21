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

const refs = getRefs();
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onScroll)

function onSearch(e) {
  e.preventDefault();
  clearImgGallary();
  imgApiService.query = e.currentTarget.elements.searchQuery.value;
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
  });
}

function onScroll(e) {
  imgApiService.fetchImg()
    .then(({hits}) => {
      if (hits.length < 40) {
        Notify.warning("We're sorry, but you've reached the end of search results.");
        appendCardMarkup(hits);
        return;
      }
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
}

function smoothlyScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

window.addEventListener('scroll',()=>{
  console.log(window.scrollY) //scrolled from top
  console.log(window.innerHeight) //visible part of screen
  if(window.scrollY + window.innerHeight >=
  document.documentElement.scrollHeight){
    onScroll();
  }
})
