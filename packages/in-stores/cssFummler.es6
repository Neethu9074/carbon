import { createStore } from 'in-stores/store';
import { find } from 'in-services/arrayUtils';

const header = createStore({
  name: 'Sticky/stores/header',
  initialValue: []
});

header.observable.nextFrame().subscribe(currentConfigs => {
  let currentTop = 0;

  for (let i = 0, length = currentConfigs.length; i < length; i++) {
    const config = currentConfigs[i];

    const headerDom = config.header;
    const headerBox = headerDom.getBoundingClientRect();

    headerDom.style.position = 'fixed';
    headerDom.style.top = `${currentTop}px`;
    headerDom.style.left = `${headerBox.left}px`;
    headerDom.style.width = `${headerBox.width}px`;
    config.wrapper.style.paddingTop = `${headerBox.height}px`;

    currentTop += headerBox.height;
  }
});

export function add(config) {
  header.applyStateMutation(currentHeader => {
    currentHeader.push(config);
    return currentHeader;
  });
}

export function remove(id) {
  header.applyStateMutation(currentHeader => {
    const config = find(currentHeader, each => each.id === id);
    if (config) {
      const index = currentHeader.indexOf(config);
      currentHeader.splice(index, 1);
    }
    return currentHeader;
  });
}
