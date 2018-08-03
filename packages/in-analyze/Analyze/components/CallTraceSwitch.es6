import React, { Fragment } from 'react';

import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CallTraceSwitch.mless';

export default function CallTraceSwitch({ totalNumberOfCalls }) {
  const loading = totalNumberOfCalls == null;
  return (
    <div className={locals.callTraceSwitch}>
      {loading ? (
        <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning width={24} height={24} />
      ) : (
        <Fragment>
          <SvgIcon className={locals.icon} type="lib_analyze" width={24} height={24} />
          {`${number.compact(totalNumberOfCalls)} `}
        </Fragment>
      )}
      Calls
    </div>
  );
}
