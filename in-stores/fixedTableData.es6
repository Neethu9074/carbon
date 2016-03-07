import * as ro from 'reactive-observables';
import Immutable from 'immutable';

const tempData = [];
for (let i = 0; i < 100; i++) {
  tempData[i] = { id: i, name: 'name ' + i, size: (Math.random() * 10000) | 0 };
}
const data = Immutable.fromJS(tempData);

export const tableData = ro.create().emit(data);
