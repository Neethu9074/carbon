export function getCountryById(countries, countryId) {
  return countries.find(country => country.id === countryId);
}

export function getStateById(states, stateId) {
  return states.find(state => state.id === stateId);
}

export function getStatesByCountryId(states, countryId) {
  return states.filter(state => state.country_id === countryId);
}
