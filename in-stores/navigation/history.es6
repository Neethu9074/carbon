/* global process:false */
import createHashHistory from 'history/createHashHistory';

let history;
//tests would fail otherwise
if (process.env.IS_TEST) {
  history = {
    push() {},
    listen() {}
  };
} else {
  history = createHashHistory();
}

export default history;
