import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/refs';

const refs = getRefs();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
}
