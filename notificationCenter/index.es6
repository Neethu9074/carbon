/*eslint-disable new-cap*/

'use strict';

import Immutable from 'immutable';

import {create} from '../conveyer';
import NotificationConveyer from '../conveyer/NotificationConveyer';

export function getActiveProblems() {
  return getStream()
    .filter(notification => {
      return notification.get('type') === 'problem' &&
        notification.getIn(['data', 'end'], null) === null;
    })
    .scan(Immutable.List(), collectingReducer)
    .debounce(10)
    .map(sortingMapper);
}

function getStream() {
  return create(NotificationConveyer);
}

function collectingReducer(notifications, notification) {
  // a notification may already exist in our list of notifications.
  // We assume that it is an update in such cases. An update may change a
  // problem's end time and other properties.
  const id = notification.get('id');
  return notifications.filter(n => n.get('id') !== id)
    .push(notification);
}

function sortingMapper(notifications) {
  return notifications.sort(function(n1, n2) {
    return n1.get('timestamp') - n2.get('timestamp');
  });
}
