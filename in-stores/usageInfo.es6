import {combineLatest} from 'reactive-observables';
import React from 'react';

import {addMessage, removeMessage} from 'in-components/MessageFlyout/stores/messages';
import createUsageInfoSubscription from 'in-services/subscription/usageInfo';
import {createTrackingStore, createStore} from 'in-stores/store';
import {toHtml} from 'in-services/formatters/markdown';

const messageId = 'usageInfo';

const usageInfo$ = createTrackingStore({
  name: 'in-stores/usageInfo/usageInfo',
  observable: createUsageInfoSubscription()
}).observable;


const usageInfoVisibleStore = createStore({
  name: 'in-stores/usageInfo/usageInfoVisible',
  initialValue: true
});
const usageInfoVisible$ = usageInfoVisibleStore.observable;

function hideUsageInfo() {
  usageInfoVisibleStore.mutateTo(false);
}

export function init() {
  // deactivate usage info handling in dev mode for some peace of mind
  if (__DEV__) {
    return;
  }

  combineLatest([usageInfo$, usageInfoVisible$])
    .subscribe(([usageInfo, visible]) => {
      if (usageInfo == null || !visible) {
        removeMessage(messageId);
      } else if (usageInfo) {
        addMessage(
          {
            type: usageInfo.get('type'),
            icon: 'info',
            content: <div dangerouslySetInnerHTML={{__html: toHtml(usageInfo.get('note'))}} />,
            onClick: hideUsageInfo
          },
          messageId
        );
      }
    });
}
