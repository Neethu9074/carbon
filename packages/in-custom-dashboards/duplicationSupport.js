import { isBlank } from 'in-services/util/string';

// This module acts as a helper to support the `Duplicate Dashboard` feature.
// We have to transfer a whole lot of information from one view to the next.
// One challenge is that this transfer needs to…
//
// 1. Work even when the users wants to duplicate in a new tab.
//    => Storage in a simple stores are therefore not possible.
// 2. Work even when the page load fails and the user refreshes.
//    => Somehow persistent for some time.
// 3. Work with a lot of data.
//    => Storage in the URL might become problematic.

const storageKey = 'in-custom-dashboard-duplication-data';

export function setDuplicationSource(config) {
  let data = getStoredData();
  // Protect against too much stored data.
  if (Object.keys(data).length > 3) {
    data = {};
  }
  data[config.id] = config;
  setStoredData(data);
}

export function getDuplicationSource(id) {
  const data = getStoredData();
  const config = data[id];
  delete data[id];
  setStoredData(data);
  return config;
}

function getStoredData() {
  try {
    const s = localStorage.getItem(storageKey);
    if (isBlank(s)) {
      return {};
    }
    return JSON.parse(s);
  } catch (e) {
    return {};
  }
}

function setStoredData(data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data, 0, 2));
  } catch (e) {
    // swallow – nothing we can do here
  }
}
