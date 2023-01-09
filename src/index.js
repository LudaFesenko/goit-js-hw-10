import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function createListItem(country) {
  return `<li class="item">
  <img class='flag-country' src="${country.flags.svg}" alt="">
  <span>${country.name.official}</span>
  </li>`;
}

function createCountryCard(country) {
  return `<div class="main-info">
  <img class="country-flag" src="${country.flags.svg}" alt="">
  <span class="country-name">${country.name.official}</span>
</div>
<div class="capital"><span class="font">Capital:</span>${country.capital}</div>
<div class="population"><span class="font">Population:</span>${
    country.population
  }</div>
<div class="languages"><span class="font">Languages:</span>${Object.values(
    country.languages
  ).join(', ')}</div>`;
}

function onSearch(evt) {
  list.innerHTML = '';
  countryInfo.innerHTML = '';

  const { value } = evt.target;
  const sanitizedValue = value.trim();

  if (!sanitizedValue) {
    return;
  }

  fetchCountries(sanitizedValue)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2) {
        const countriesItems = countries
          .map(country => createListItem(country))
          .join('');
        list.insertAdjacentHTML('beforeend', countriesItems);
      } else if (countries.length === 1) {
        countryInfo.insertAdjacentHTML(
          'beforeend',
          createCountryCard(countries[0])
        );
      } else {
        Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
    });
}
