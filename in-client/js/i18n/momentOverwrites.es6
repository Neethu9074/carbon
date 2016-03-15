import moment from 'moment';

// extending the included date format to show seconds as these are important
// for us.
moment.updateLocale('en', {
  longDateFormat: {
    LT: 'HH:mm:ss'
  }
});
