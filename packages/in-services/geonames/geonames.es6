/**
 * The data being used in has been copied from this repo:
 * https://github.com/stefanbinder/countries-states
 *
 * The purpose is to provide a selectbox of countries with their corresponding
 * states which is being used in the "req. a quote" popup.
 *
 * @see RequestQuoteDialog.es6
 */

export function getCountries(geodata) {
  return geodata.map(g => g.name);
}

export function getStatesByCountryName(geodata, countryName) {
  const country = geodata.find(g => g.name === countryName);
  if (country == null) {
    return [];
  }

  return country.states;
}
