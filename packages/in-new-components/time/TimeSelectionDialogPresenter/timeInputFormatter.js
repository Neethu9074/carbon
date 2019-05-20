import moment from 'moment';

export default function formatInputTime(input, format) {
  const date = moment(input, format);
  if (date.isValid()) {
    return date.format(format);
  } else {
    return input;
  }
}
