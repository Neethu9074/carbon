import {PERSIST_LOGICAL_SERVICE_POSITIONS, SERVICE_POSITION_STORAGE_TTL} from 'in-map/misc/TimingConfig';
import {nodePositions$, changePosition, removeId} from 'in-map/stores/logical/layouterStore';
import {setTimeout, clearTimeout} from 'in-services/chronos';


const layoutingPath = 'in-layouting';

nodePositions$.distinct()
              .debounce(PERSIST_LOGICAL_SERVICE_POSITIONS, {setTimeout, clearTimeout})
              .subscribe(nodes => save(nodes));

function save(nodes) {
  if (typeof(localStorage) !== 'undefined') {
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
    if (!item || item.timestamp < now - SERVICE_POSITION_STORAGE_TTL) {
      removeId(key);
    } else {
      changePosition(key, item.x, item.y, item.z);
    }
  });
}
