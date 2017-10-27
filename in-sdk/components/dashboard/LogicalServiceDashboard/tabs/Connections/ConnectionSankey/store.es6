import { createStore } from 'in-stores/store';

import { sizeByCalls } from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionSankey/data';

const store = createStore({
  name: `service/ConnectionSankey/sizing`,
  initialValue: sizeByCalls,
  reducers: {
    set(state, action) {
      return action.newSizing;
    }
  }
});

export const sizeBy$ = store.observable;

export function setSizing(newSizing) {
  store.applyStateMutation({ type: 'set', newSizing });
}
