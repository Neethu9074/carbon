import {List, fromJS} from 'immutable';

import {always} from 'in-services/fixedStreams';


const logs = List([
  fromJS({
    id: '1'
  }),
  fromJS({
    id: '2'
  })
]);
export default function createAuditLogSubscription() {
  return always(logs);
}
