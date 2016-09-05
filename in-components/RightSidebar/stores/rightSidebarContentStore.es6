import React from 'react';

import {activeControl$} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {CONTROL_TYPES} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import Notifications from 'in-components/RightSidebar/components/Notifications';
import {createStore} from 'in-stores/store';


const content = createStore({
  name: 'rightSidebar/contentStore',
  initialValue: null
});
export const content$ = content.observable;


const CONTENT = {};

CONTENT[CONTROL_TYPES.NOTIFICATIONS] = {
  title: 'Notifications',
  content: <Notifications />
};

activeControl$.subscribe(activeControl => content.applyStateMutation(() => CONTENT[activeControl]));
