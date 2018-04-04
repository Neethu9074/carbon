import { fromJS } from 'immutable';

export default function convert(span) {
  if (!span) {
    return null;
  }
  const type = Object.keys(span)[0];
  if (!type) {
    return null;
  }

  const fakedSpan = {
    name: type,
    data: {}
  };
  fakedSpan.data[type] = span[type];

  return fromJS(fakedSpan);
}
