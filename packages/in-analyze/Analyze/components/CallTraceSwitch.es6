import React from 'react';

import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CallTraceSwitch.mless';

export default function CallTraceSwitch({ totalNumberOfCalls }) {
  return (
    <div className={locals.callTraceSwitch}>
      {totalNumberOfCalls && <SvgIcon className={locals.icon} type="lib_analyze" width={24} height={24} />}
      {!totalNumberOfCalls && (
        <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning width={24} height={24} />
      )}
      {totalNumberOfCalls && `${number.compact(totalNumberOfCalls)} `}
      Calls
    </div>
  );
}
