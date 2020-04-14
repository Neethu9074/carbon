import React from 'react';

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
import CustomTime from 'in-new-components/time/TimeSelectionDialogPresenter/CustomTime';
import Presets from 'in-new-components/time/TimeSelectionDialogPresenter/Presets';
import { isView } from 'in-stores/navigation/navigation';
import { analyze } from 'in-analyze/navigation/paths';
import connectTo from 'in-hoc/connectTo';

import locals from './TimeSelectionDialogPresenter.mless';

export default connectTo(
  {
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
  },
  function TimeSelectionDialogPresenter(props) {
    const containsHistoricData = props.historicOrLargeDataResult?.containsHistoricData ?? props.containsHistoricData;
    return (
      <div>
        <section className={locals.wrapper}>
          <CustomTime {...props} containsHistoricData={containsHistoricData} />
          <Presets {...props} containsHistoricData={containsHistoricData} />
        </section>
      </div>
    );
  }
);
