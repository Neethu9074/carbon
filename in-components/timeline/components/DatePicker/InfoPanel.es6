import React from 'react';

import {live$} from 'in-components/timeline/components/DatePicker/stores/liveStore';
import connectTo from 'in-hoc/connectTo';

import './InfoPanel.less';


const block = 'in-timeline-date-time-picker-info-panel';

export default connectTo({
  live: live$
},
function InfoPanel({live}) {
  return (
    <div className={block}>
      {live
        ? 'In live mode Instana shows the current state of your monitored environment. The Selected Moment is set to live. You can adjust the time window size to increase the data shown in the dashboards, trace- and incident-view and in the timeline.'
        : 'When not in live mode Instana shows the state of your monitored environment for the Selected Moment. You can adjust the From and To time as well as the Selected Moment to investigate specific time ranges. Please note that your environment can change constantly. In this mode Instana displays its state at the Selected Moment.'
      }
    </div>
  );
});
