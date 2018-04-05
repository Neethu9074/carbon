import { fromJS } from 'immutable';

export default function convert(span) {
  if (!span) {
    return null;
  }

  const type = span.name;
  const fakedSpan = {
    name: type,
    data: span.data
  };

  return fromJS(fakedSpan);
}
