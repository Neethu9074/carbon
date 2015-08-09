

import moment from 'moment';

// extending the included date format to show seconds as these are important
// for us.
moment.locale('en', {
  longDateFormat: {
    LT: 'h:mm:ss A'
  }
});
