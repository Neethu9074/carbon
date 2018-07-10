import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './PresenterPastLiveDataSection.mless';

export default function PresenterPastLiveDataSection() {
  return (
    <div className={locals.wrapper}>
      <SvgIcon className={locals.icon} type="lib_help_error_error_circle" width={32} />
      <h2 className={locals.title}>Past Live Data</h2>
      <p className={locals.text} />
    </div>
  );
}
