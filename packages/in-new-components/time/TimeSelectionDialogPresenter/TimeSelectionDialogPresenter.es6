import React from 'react';

import PresenterPastLiveDataSection from 'in-new-components/time/TimeSelectionDialogPresenter/PresenterPastLiveDataSection';
import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import CustomTime from 'in-new-components/time/TimeSelectionDialogPresenter/CustomTime';
import Presets from 'in-new-components/time/TimeSelectionDialogPresenter/Presets';

import locals from './TimeSelectionDialogPresenter.mless';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    containsPastLiveData: containsPastLiveData$(props.timeConfig, props.containsPastLiveData)
  }),
  function TimeSelectionDialogPresenter(props) {
    return (
      <div>
        <section className={locals.wrapper}>
          <CustomTime {...props} />
          <Presets {...props} />
        </section>

        {props.containsPastLiveData && <PresenterPastLiveDataSection />}
      </div>
    );
  }
);
