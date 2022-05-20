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
}
