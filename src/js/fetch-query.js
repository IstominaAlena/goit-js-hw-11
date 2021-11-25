import axios from 'axios';

export const fetchQuery = name => {
  localStorage.setItem('per_page', 40);
  const perPage = localStorage.getItem('per_page');
  const API_KEY = '24480883-e3616999421f7f8a627deaac2';
  const BASE_URL = 'https://pixabay.com/api';
  let page = Number(localStorage.getItem('page'));

  return axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: name,
      image_type: 'photo',
      page,
      per_page: perPage,
      orientation: 'horizontal',
      safesearch: true,
    },
  });
};
