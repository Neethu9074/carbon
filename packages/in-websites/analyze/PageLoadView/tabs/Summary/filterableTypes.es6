export const types = {
  xhr: {
    short: 'XHR',
    long: 'XHR and Fetch',
    color: 'purple'
  },
  javascript: {
    short: 'JS',
    long: 'Scripts',
    color: '#ebd31e' // inspired by the JS logo color
  },
  css: {
    short: 'CSS',
    long: 'Stylesheets',
    color: '#2277FF' // based on the CSS logo color
  },
  img: {
    short: 'Img',
    long: 'Images',
    color: 'green'
  },
  document: {
    short: 'Doc',
    long: 'Documents',
    color: '#F16528' // based on the HTML logo color
  },
  error: {
    short: 'Err',
    long: '(Un-)caught JavaScript Errors',
    color: 'darkred'
  },
  other: {
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

export function getResourceTypes() {
  return Object.keys(types)
    .filter(k => k !== 'xhr' && k !== 'error') // Errors and XHR don't make sense as resource types
    .sort();
}

export function getResourceTypesComboBoxItems(restrict = null) {
  return getResourceTypes()
    .filter(k => restrict == null || restrict.indexOf(k) !== -1)
    .reduce(
      (agg, k) =>
        agg.concat({
          value: k,
          label: types[k].short
        }),
      []
    );
}
