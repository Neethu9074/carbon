import Handlebars from 'handlebars/dist/handlebars.min.js';

export default Handlebars;

// Example
// {{ truncate Hello World 4}} resolves to Hell
Handlebars.registerHelper('truncate', (str, num) => (str.length > num ? str.slice(0, num > 3 ? num - 3 : num) : str));

// Example
// {{ takeFirst Instana-says-Hello-World 3 '-'}} resolves to Instana-says-Hello
Handlebars.registerHelper('takeFirst', (str, num, separator) => {
  return str
    .split(separator)
    .slice(0, num)
    .join(separator);
});
