import React from 'react';
import {combineLatest} from 'reactive-observables';

import {addMessage, removeMessage} from 'in-components/MessageFlyout/stores/messages';
import createUsageInfoSubscription from 'in-services/subscription/usageInfo';
import {createTrackingStore, createStore} from 'in-stores/store';
import {toHtml} from 'in-services/formatters/markdown';

const messageId = 'usage-info';

const usageInfo$ = createTrackingStore({
  name: 'in-stores/usageInfo/usageInfo',
  observable: createUsageInfoSubscription()
}).observable;


const usageInfoVisibleStore = createStore({
  name: 'in-stores/usageInfo/usageInfoVisible',
  initialValue: true
});
const usageInfoVisible$ = usageInfoVisibleStore.observable;

export function hideUsageInfo() {
  usageInfoVisibleStore.mutateTo(false);
}

export function init() {
  combineLatest([usageInfo$, usageInfoVisible$])
    .subscribe(([usageInfo, visible]) => {
      if (usageInfo == null || !visible) {
        removeMessage(messageId);
      }

      if (usageInfo) {
        addMessage(
          usageInfo.get('type'),
          <span dangerouslySetInnerHTML={{__html: toHtml(usageInfo.get('note'))}} />,
          messageId
        );
      }
    });
}
