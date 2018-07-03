/* global process:false */
import { createMemoryHistory, createHashHistory } from 'history';

import { wrap } from 'in-stores/navigation/routing/matrixAwareHistory';

let history;
//tests would fail otherwise
if (process.env.IS_TEST) {
  history = createMemoryHistory();
} else {
  history = createHashHistory();
}

export default wrap(history);
