import moment from 'moment';

// extending the included date format to show seconds as these are important
// for us.
moment.updateLocale('en', {
  longDateFormat: {
    LT: 'HH:mm:ss'
  }
});

moment.parseTimeString = str => {
  if (!str) {
    return undefined;
  }

  str = str.split(':');
  if (str.length !== 3) {
    return undefined;
  }

  const hour = parseInt(str[0], 10);
  const minute = parseInt(str[1], 10);
  const sec = parseInt(str[2], 10);

  if (isNaN(hour) || isNaN(minute) || isNaN(sec)) {
    return undefined;
  }

  return {hour, minute, sec};
};
