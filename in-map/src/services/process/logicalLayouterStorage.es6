import {nodePositions$, changePosition, removeId} from 'in-map/src/stores/process/logicalLayouterStore';


const layoutingPath = 'in-layouting';
const TIME_TO_LIFE = 1000 * 60 * 60 * 24 * 7; // 1 week


nodePositions$.distinct()
              .debounce(5000)
              .subscribe(nodes => save(nodes));

function save(nodes) {
  console.log('try save');
  if (typeof(localStorage) !== 'undefined') {
    console.log('save');
    localStorage.setItem(layoutingPath, JSON.stringify(nodes.toJS()));
  }
}

export function init() {
  if (typeof(localStorage) === 'undefined') {
    return;
  }
  const temp = localStorage.getItem(layoutingPath);
  if (!temp) {
    return;
  }

  const fromStorage = JSON.parse(temp);

  const now = Date.now();
  Object.keys(fromStorage).forEach(key => {
    const item = fromStorage[key];
    if (item.timestamp < now - TIME_TO_LIFE) {
      removeId(key);
    } else {
      changePosition(key, item.x, item.y, item.z);
    }
  });
}
