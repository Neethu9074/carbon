/**
 * The data being used in has been copied from this repo:
 * https://github.com/harpreetkhalsagtbit/country-state-city
 *
 * The purpose is to provide a selectbox of countries with their corresponding
 * states which is being used in the "req. a quote" popup.
 *
 * @see RequestQuoteDialog.es6
 */

export function getCountryById(countries, countryId) {
  return countries.find(country => country.id === countryId);
}

export function getStateById(states, stateId) {
  return states.find(state => state.id === stateId);
}

export function getStatesByCountryId(states, countryId) {
  return states.filter(state => state.country_id === countryId);
}
