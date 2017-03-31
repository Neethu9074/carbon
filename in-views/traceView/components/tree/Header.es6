/* eslint-disable max-len */
import React from 'react';

import ServiceImplementationEntityInformation
  from 'in-views/traceView/components/ServiceImplementationEntityInformation';
import { getErrorCount, getDepth, getCalls, getPerCategorySummary } from 'in-views/traceView/util';
import ServiceEntityInformation from 'in-views/traceView/components/ServiceEntityInformation';
import TraceDownloadView from 'in-components/DownloadButton/components/TraceDownloadView';
import { getCurrentViewWithTimelineCenteredAt } from 'in-stores/navigation/timeline';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import CategoryIcon from 'in-views/traceView/components/tree/CategoryIcon';
import { msZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import DownloadButton from 'in-components/DownloadButton';
import { isShowSelfTimeForCategory } from 'in-sdk/tracing';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { getLabel } from 'in-sdk/tracing';

import './Header.less';

const block = 'in-trace-view-details-header';

export default connectTo(
  props => {
    return {
      timelineLink: getCurrentViewWithTimelineCenteredAt(props.trace.get('start'))
    };
  },
  function TraceHeader({ trace, timelineLink }) {
    const errorCount = getErrorCount(trace);
    const depth = getDepth(trace);
    const calls = getCalls(trace);

    const perCategorySummary = getPerCategorySummary(trace);
    const categories = Object.keys(perCategorySummary).sort();

    return (
      <div className={block}>
        <DownloadButton className={`${block}__download-link`}>
          <TraceDownloadView trace={trace} />
        </DownloadButton>

        <div className={`${block}__date`}>
          <Tooltip content="Center timeline around this trace's start time.">
            <a href={timelineLink} className={`${block}__timeline-link`}>
              {formatDateTime(trace.get('start'))}
            </a>
          </Tooltip>
        </div>
        <div className={`${block}__description`}>
          <h1 className={`${block}__title`}>
            {getLabel(trace)}
          </h1>

          <div className={`${block}__entity`}>
            <ServiceImplementationEntityInformation span={trace} connectionEndpointType="destination" />
          </div>

          <div className={`${block}__entity`}>
            <ServiceEntityInformation span={trace} label="Service:" />
          </div>

          <div className={`${block}__stats`}>
            <LabeledValue label="Total">
              {msZeroDecimalPlaces(trace.get('duration'))}
            </LabeledValue>

            <LabeledValue
              label="Errors"
              style={{
                color: errorCount > 0 ? '#D0021B' : undefined
              }}
            >
              {errorCount}
            </LabeledValue>

            <Tooltip content="Calls to services">
              <LabeledValue label="Calls">
                {calls}
              </LabeledValue>
            </Tooltip>

            <Tooltip content="Maximum service call nesting">
              <LabeledValue label="Depth">
                {depth}
              </LabeledValue>
            </Tooltip>

            <ul className={`${block}__category-list`}>
              {categories.map(category => {
                let tooltip;
                if (isShowSelfTimeForCategory(category)) {
                  tooltip = `${perCategorySummary[category].calls} ${category} spans at a total self time of ${msZeroDecimalPlaces(perCategorySummary[category].durationSelf)}`;
                } else {
                  tooltip = `${perCategorySummary[category].calls} ${category} spans`;
                }
                return (
                  <Tooltip content={tooltip} key={category}>
                    <li className={`${block}__category`}>
                      <CategoryIcon category={category} />
                      <span className={`${block}__category-call-count`}>
                        {perCategorySummary[category].calls}
                      </span>
                      <span className={`${block}__category-self-time`}>
                        &nbsp;

                        {isShowSelfTimeForCategory(category)
                          ? '(' + msZeroDecimalPlaces(perCategorySummary[category].durationSelf) + ')'
                          : null}
                      </span>
                    </li>
                  </Tooltip>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
);
