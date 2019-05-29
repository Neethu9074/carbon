import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import { getSamplingLevel$ } from 'in-subscription/application/getSamplingLevel';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import { percentage } from 'in-services/formatters/number';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { timeConfig$ } from 'in-stores/time/config';
import { isInstanaEngineer } from 'in-stores/user';
import SvgIcon from 'in-components/SvgIcon';
import { just } from 'reactive-observables';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './HistoricAndLargeDataIndicator.mless';

const HISTORIC_DATA_MESSAGE = 'Historic Data - Showing approximate data due to the data retention settings. ';
const LARGE_DATA_MESSAGE =
  'Large Dataset - Showing approximate data, reduce the selected time range for precise data. ';

export const historicOrLargeDataResult$ = timeConfig$.flatMap(timeConfig =>
  containsPastLiveData$(timeConfig)
    .flatMap(
      containsPastLiveData =>
        containsPastLiveData
          ? // if the selected timeframe contains historic data,
            // there's no need to query for the sampling level
            just({
              containsPastLiveData: true
            })
          : // if not, query the sampling level
            getSamplingLevel$(timeConfig).flatMap(samplingLevel =>
              just({
                containsPastLiveData: false,
                samplingLevel
              })
            )
    )
    .startWith(false)
);

export default connectTo(
  {
    historicOrLargeDataResult: historicOrLargeDataResult$
  },

  function HistoricAndLargeDataIndicator({ historicOrLargeDataResult }) {
    if (!samplingIndicatorEnabled) return null;

    const { containsPastLiveData, samplingLevel } = historicOrLargeDataResult;

    let icon;
    let tooltipMessage;
    if (containsPastLiveData) {
      tooltipMessage = HISTORIC_DATA_MESSAGE;
      icon = <TimeIcon theme="light" containsPastLiveData />;
    } else {
      if (samplingLevel && samplingLevel.samplingRatio < 1) {
        tooltipMessage = LARGE_DATA_MESSAGE;
        icon = <ApproximateIcon />;
      } else {
        return null;
      }
    }

    return (
      <Tooltip
        align="rightMiddle"
        themeStyle="light"
        content={<TooltipContent message={tooltipMessage} samplingLevel={samplingLevel} />}
      >
        {icon}
      </Tooltip>
    );
  }
);

function ApproximateIcon() {
  return <SvgIcon className={locals.approximateIcon} type="lib_approximately_equal" width={24} />;
}

function TooltipContent({ message, samplingLevel }) {
  return (
    <div>
      {message}
      {isInstanaEngineer && ` (sampling ratio = ${percentage.detailed(samplingLevel.samplingRatio)})`}
    </div>
  );
}
