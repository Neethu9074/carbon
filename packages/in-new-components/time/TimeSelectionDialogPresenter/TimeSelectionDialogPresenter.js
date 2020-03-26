import React from 'react';

import { retention$ } from 'in-subscription/application/getRetention';
import CustomTime from 'in-new-components/time/TimeSelectionDialogPresenter/CustomTime';
import Presets from 'in-new-components/time/TimeSelectionDialogPresenter/Presets';
import { isView } from 'in-stores/navigation/navigation';
import { analyze } from 'in-analyze/navigation/paths';
import {
  applicationsList,
  applicationDashboard,
  newApplicationView,
  newApplicationWaiterView,
  servicesList,
  serviceDashboard,
  newServiceView,
  endpointDashboard
} from 'in-applications/navigation/paths';

import locals from './TimeSelectionDialogPresenter.mless';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    containsPastLiveData: retention$(props.timeConfig, props.containsPastLiveData),
    isApp20View: isView(
      analyze,
      applicationsList,
      applicationDashboard,
      newApplicationView,
      newApplicationWaiterView,
      servicesList,
      serviceDashboard,
      newServiceView,
      endpointDashboard
    ).map(data => data.containsPastLiveData)
  }),
  function TimeSelectionDialogPresenter(props) {
    return (
      <div>
        <section className={locals.wrapper}>
          <CustomTime {...props} />
          <Presets {...props} />
        </section>
      </div>
    );
  }
);
