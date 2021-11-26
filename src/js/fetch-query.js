import axios from 'axios';

const API_KEY = '24480883-e3616999421f7f8a627deaac2';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchQuery = async name => {
  let page = Number(localStorage.getItem('page'));
  localStorage.setItem('per_page', 40);
  const perPage = localStorage.getItem('per_page');

  const result = await axios.get(`${BASE_URL}`, {
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
  return result;
};
