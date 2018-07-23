import React from 'react';

import PresenterPastLiveDataSection from 'in-new-components/time/TimeSelectionDialogPresenter/PresenterPastLiveDataSection';
import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
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
    containsPastLiveData: containsPastLiveData$(props.timeConfig, props.containsPastLiveData),
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
    )
  }),
  function TimeSelectionDialogPresenter(props) {
    return (
      <div>
        <section className={locals.wrapper}>
          <CustomTime {...props} />
          <Presets {...props} />
        </section>

        {props.containsPastLiveData && props.isApp20View && <PresenterPastLiveDataSection />}
      </div>
    );
  }
);
