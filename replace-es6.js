// eslint-disable-next-line no-undef
const replace = require('replace-in-file');

// Replace all occurences of .es6 file extension in files
const options = {
  files: ['./packages/**/*.es6', './packages/**/*.js', './packages/**/*package.json'],
  from: /\.es6/g,
  to: '.js',
  ignore: './**/*/node_modules/*',
  // dry: true,
  countMatches: true
};

replace(options)
  .then(results => {
    const changedFiles = results.filter(({ hasChanged }) => !!hasChanged);
    // eslint-disable-next-line no-console
    console.log('✅ Replaced occurences of .es6 in:', changedFiles);
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error('🚫 Error while replacing occurences of .es6 in:', error);
  });
