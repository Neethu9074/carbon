import React from 'react';

import {activeControl$} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {CONTROL_TYPES} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import MapStatistics from 'in-components/RightSidebar/components/MapStatistics';
import Notifications from 'in-components/RightSidebar/components/Notifications';
import ResetButton from 'in-components/RightSidebar/components/ResetButton';
import Metrics from 'in-components/RightSidebar/components/Metrics';
import Tags from 'in-components/RightSidebar/components/Tags';
import {removeAllTagFilters} from 'in-stores/search/tags';
import {clearActiveMetric} from 'in-stores/metric';
import {SvgIconList} from 'in-components/SvgIcon';
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
CONTENT[CONTROL_TYPES.ICONS] = {
  title: 'Icons',
  content: <SvgIconList />
};
CONTENT[CONTROL_TYPES.MAP_STATISTICS] = {
  title: 'Map Statistics',
  content: <MapStatistics />
};
CONTENT[CONTROL_TYPES.TAGS] = {
  title: 'Tags',
  content: <Tags />,
  additionalHeaderContent: <ResetButton onClick={removeAllTagFilters}/>
};
CONTENT[CONTROL_TYPES.METRICS] = {
  title: 'Metrics',
  content: <Metrics />,
  additionalHeaderContent: <ResetButton onClick={clearActiveMetric} />
};

activeControl$.subscribe(activeControl => content.applyStateMutation(() => CONTENT[activeControl]));
