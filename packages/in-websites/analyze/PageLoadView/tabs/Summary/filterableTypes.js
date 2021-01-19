/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const types = {
  xhr: {
    short: 'XHR',
    badgeLabel: 'XHR',
    long: 'XHR and Fetch',
    color: '#8900b3'
  },
  javascript: {
    short: 'JS',
    badgeLabel: 'JS',
    long: 'Scripts',
    color: '#d3bd12' // inspired by the JS logo color
  },
  css: {
    short: 'CSS',
    badgeLabel: 'CSS',
    long: 'Stylesheets',
    color: '#2277FF' // based on the CSS logo color
  },
  img: {
    short: 'Img',
    badgeLabel: 'IMG',
    long: 'Images',
    color: '#00b37a'
  },
  font: {
    short: 'Font',
    badgeLabel: 'FNT',
    long: 'Web Fonts',
    color: '#ce1293'
  },
  document: {
    short: 'Doc',
    badgeLabel: 'Doc',
    long: 'Documents (Page Loads)',
    color: '#F16528' // based on the HTML logo color
  },
  pageChange: {
    short: 'Tra',
    badgeLabel: 'Tra',
    long: 'Page Transitions',
    color: '#91c200'
  },
  error: {
    short: 'Err',
    badgeLabel: 'Err',
    long: '(Un-)caught JS Errors',
    color: 'darkred'
  },
  custom: {
    short: 'Cus',
    badgeLabel: 'Cus',
    long: 'Custom Events',
    color: '#009e89'
  },
  other: {
    short: 'Other',
    badgeLabel: 'Oth',
    long: 'Other',
    color: 'darkgray'
  }
};

export function getType(beacon) {
  if (types[beacon.resourceType]) {
    return beacon.resourceType;
  } else if (beacon.type === 'error') {
    return 'error';
  } else if (beacon.type === 'custom') {
    return 'custom';
  } else if (beacon.type === 'pageChange') {
    return 'pageChange';
  }

  return 'other';
}

export function getResourceTypes() {
  return (
    Object.keys(types)
      // Errors and XHR don't make sense as resource types
      .filter(k => k && k !== 'xhr' && k !== 'error' && k !== 'custom' && k !== 'pageChange')
      .sort()
  );
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
