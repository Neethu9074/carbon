export const types = {
  'document': {
    short: 'Doc',
    long: 'Documents',
    color: '#F16528' // based on the HTML logo color
  },
  'javascript': {
    short: 'JS',
    long: 'Scripts',
    color: '#ebd31e' // inspired by the JS logo color
  },
  'css': {
    short: 'CSS',
    long: 'Stylesheets',
    color: '#2277FF' // based on the CSS logo color
  },
  'img': {
    short: 'img',
    long: 'Images',
    color: 'green'
  },
  'xhr': {
    short: 'XHR',
    long: 'XHR and Fetch',
    color: 'purple'
  },
  'error': {
    short: 'Errors',
    long: '(Un-)caught JavaScript Errors',
    color: 'darkred'
  },
  'other': {
    short: 'Other',
    long: 'Other',
    color: 'darkgray'
  }
};

export function getType(beacon) {
  if (types[beacon.resourceType]) {
    return beacon.resourceType;
  }

  if (beacon.type === 'error') {
    return 'error';
  }

  return 'other';
}
