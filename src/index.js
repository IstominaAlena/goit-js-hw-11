import './sass/main.scss';

import { smoothScroll } from './js/smooth-scroll';
import { fetchQuery } from './js/fetch-query';
import galleryTemplate from './templates/gallery-template.hbs';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
const message = document.querySelector('.message-text');
let lightboxGallery;

formEl.addEventListener('submit', onSubmitFn);

// Функция при сабмите формы
function onSubmitFn(evt) {
  evt.preventDefault();

  let currentQuery = evt.target.querySelector('input[name="searchQuery"]').value.trim();

  onInputCheckFn(currentQuery);

  clearGalleryFn();

  hideHTMLelem(message);
}

// Проверка валидности введеной информации
async function onInputCheckFn(value) {
  if (!value) {
    return Notify.failure('Please, enter the query');
  }

  localStorage.setItem('query', value);
  localStorage.setItem('page', 1);

  // fetchQuery(value).then(responseCheckFn).catch(console.log);

  try {
    const result = await fetchQuery(value);
    responseCheckFn(result);
  } catch (error) {
    console.log(error);
  }
}

// Проверка содержимого в ответе
function responseCheckFn({ data: { hits, totalHits } }) {
  if (!hits.length) {
    hideHTMLelem(loadMoreBtn);
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  renderGalleryCardsFn(hits);

  // Создание листаемой галереи с помощью библиотеки
  lightboxGallery = new SimpleLightbox('.gallery-link');

  const pageLimit = Number(localStorage.getItem('per_page'));

  // Если на страницу приходит совсем мало элементов
  if (hits.length < pageLimit || totalHits === pageLimit) {
    hideHTMLelem(loadMoreBtn);
    showHTMLelem(message);
    return;
  }

  showHTMLelem(loadMoreBtn);
}

// Отрисовка карточек галереи
function renderGalleryCardsFn(array) {
  // galleryContainer.innerHTML = galleryTemplate(array); //если использовать это, то ф-ция clearGalleryFn не нужна
  galleryContainer.insertAdjacentHTML('beforeend', galleryTemplate(array));
}

// Очистка галереи при новом поиске
function clearGalleryFn() {
  galleryContainer.innerHTML = '';
}

loadMoreBtn.addEventListener('click', loadMoreBtnFn);

// Функция при клике на кнопку Load more
async function loadMoreBtnFn() {
  let value = localStorage.getItem('query');

  // fetchQuery(value)
  //   .then(resp => {
  //     loadMoreElem(resp);
  //     // Обновление листаемой галереи с помощью библиотекиб после подгрузки новых фоток
  //     lightboxGallery.refresh();
  //     onGalleryCheckFn(resp);
  //   })
  //   .catch(console.log);

  try {
    const result = await fetchQuery(value);
    loadMoreElem(result);
    lightboxGallery.refresh();
    onGalleryCheckFn(result);
  } catch (error) {
    console.log(error);
  }
  pageIterationFn();

  smoothScroll();
}

// Увеличение номера страницы
function pageIterationFn() {
  let page = Number(localStorage.getItem('page')) + 1;
  localStorage.setItem('page', JSON.stringify(page));
}

// Проверка ответа при итерации страницы
function onGalleryCheckFn({ data }) {
  let page = localStorage.getItem('page');
  const perPage = Number(localStorage.getItem('per_page'));
  let pageAmount = Math.ceil(data.totalHits / perPage);

  if (page >= pageAmount) {
    hideHTMLelem(loadMoreBtn);
    showHTMLelem(message);
  }
}

// Подгрузка нового контента к уже существующему
function loadMoreElem({ data }) {
  galleryContainer.insertAdjacentHTML('beforeend', galleryTemplate(data.hits));
}

// Показать/спрятать нужные элементы
function hideHTMLelem(elem) {
  elem.classList.add('is-hidden');
}
function showHTMLelem(elem) {
  elem.classList.remove('is-hidden');
}
