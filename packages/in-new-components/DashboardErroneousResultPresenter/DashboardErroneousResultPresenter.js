import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';

import locals from './DashboardErroneousResultPresenter.mless';

export default function DashboardErroneousResultPresenter(props) {
  return <ErroneousResultPresenter {...props} className={locals.wrapper} />;
}
