'use strict';

import moment from 'moment';

// extending the included date format to show seconds as these are important
// for us.
moment.lang('en', {
  longDateFormat: {
    LT: 'h:mm:ss A'
  }
});
