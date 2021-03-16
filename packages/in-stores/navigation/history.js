/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
