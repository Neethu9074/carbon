import React from 'react';

import CustomTime from 'in-new-components/time/TimeSelectionDialogPresenter/CustomTime';
import Presets from 'in-new-components/time/TimeSelectionDialogPresenter/Presets';

import locals from './TimeSelectionDialogPresenter.mless';

export default function TimeSelectionDialogPresenter(props) {
  return (
    <section className={locals.wrapper}>
      <CustomTime {...props} />
      <Presets {...props} />
    </section>
  );
}
