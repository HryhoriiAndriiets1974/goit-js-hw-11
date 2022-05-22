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
let autoScroll = false;
const refs = getRefs();
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onScroll);
refs.upBtn.addEventListener('click', onUpBtn);
document.addEventListener('DOMContentLoaded', infinitiScroll);

// ========================================== bed old 1/2
// window.addEventListener('scroll', infinitiScroll);

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
    autoScroll = true;
    // smoothlyScroll();
  });
}

function onScroll(e) {
  if (!autoScroll) {
    e.preventDefault();
  }

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
    .catch(error => {
      console.log(error);
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
// =============================================== bed old 2/2
// function infinitiScroll() {
//     console.log(window.scrollY + window.innerHeight +1 - document.documentElement.scrollHeight);
//   if(window.scrollY + window.innerHeight + 1 >=
//   document.documentElement.scrollHeight && stopScroll) {
//     onScroll();
//   }};

  function infinitiScroll() {
  let options = {
    root: null,
    rootMargins: "0px",
    threshold: 0
  };
  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(document.querySelector("footer"));
  //an initial load of some data
  onScroll();
};

function handleIntersect(entries) {
  if (entries[0].isIntersecting && stopScroll) {
    // console.warn("something is intersecting with the viewport");
    onScroll();
  }
}

function onUpBtn() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(onUpBtn, 0);
  }
}
