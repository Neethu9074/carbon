/* eslint-disable complexity */
import moment from 'moment';
// extending the included date format to show seconds as these are important for us.
import {timeFormat} from 'in-services/formatters/date';

// extending the included date format to show seconds as these are important for us.
moment.updateLocale('en', {
  longDateFormat: {
    LT: timeFormat
  }
});
