import debounce from 'lodash.debounce';
import API from './fetchCountries.js';
import templateCountry from '../templates/templateCountry.hbs';
import templateListOfCountries from '../templates/templateListOfCountries.hbs';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
    input: document.querySelector('.input-js'),
    cardContainer: document.querySelector('.countries-list-js'),
}

let searchCountry = '';

refs.input.addEventListener('input',
  debounce(() => {
    onSearch();
  }, 500));

function onSearch() {
  searchCountry = refs.input.value;

  if (!searchCountry) {
    clearMarkup();
    return;
  }

  API.fetchCountries(searchCountry)
    .then(checkingNumberOfCountries)
    .catch(onFetchError);
}

function checkingNumberOfCountries(countries) {
  if (countries.length > 10) {
    clearMarkup();
    tooManyCountries();
  } else if (countries.length <= 10 && countries.length > 1) {
    clearMarkup();
    renderMarkup(templateListOfCountries, countries);
  } else if (countries.length === 1) {
    clearMarkup();
    renderMarkup(templateCountry, countries[0]);
  } else {
    clearMarkup();
    noResult();
  }
}

function renderMarkup(template, countries) {
  const markup = template(countries);
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.cardContainer.innerHTML = '';
}

function noResult() {
  info({
    text: 'No matches found!',
    delay: 1500,
    closerHover: true,
  });
}

function tooManyCountries() {
  error({
    text: 'Too many matches found. Please enter a more specific query!',
    delay: 2500,
    closerHover: true,
  });
}

function onFetchError(error) {
    clearMarkup();

    console.log(error);
}

