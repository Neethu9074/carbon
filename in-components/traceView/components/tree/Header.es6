/* eslint-disable max-len */
import React from 'react';

import {getErrorCount, getDepth, getCalls, getPerCategorySummary} from 'in-components/traceView/util';
import SpanEntityInformation from 'in-components/traceView/components/SpanEntityInformation';
import CategoryIcon from 'in-components/traceView/components/tree/CategoryIcon';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {formatDateTime} from 'in-services/formatters/date';
import Tooltip from 'in-components/Tooltip';
import {getLabel} from 'in-sdk/tracing';

import './Header.less';

const block = 'in-trace-view-details-header';

export default function TraceHeader({trace}) {
  const errorCount = getErrorCount(trace);
  const depth = getDepth(trace);
  const calls = getCalls(trace);

  const perCategorySummary = getPerCategorySummary(trace);
  const categories = Object.keys(perCategorySummary).sort();

  return (
    <div className={block}>
      <div className={`${block}__date`}>
        {formatDateTime(trace.get('start'))}
      </div>
      <div className={`${block}__description`}>
        <h1 className={`${block}__title`}>
          {getLabel(trace)}
        </h1>

        <div className={`${block}__entity`}>
          <SpanEntityInformation span={trace}
                                 label='On:'
                                 connectionEndpointType='destinationId' />
        </div>

        <div className={`${block}__stats`}>
          <LabeledValue label='Total'>
            {msZeroDecimalPlaces(trace.get('duration'))}
          </LabeledValue>

          <LabeledValue label='Errors'
                        style={{
                          color: errorCount > 0 ? '#D0021B' : undefined
                        }}>
            {errorCount}
          </LabeledValue>

          <Tooltip content='Calls to services'>
            <LabeledValue label='Calls'>
              {calls}
            </LabeledValue>
          </Tooltip>

          <Tooltip content='Maximum service call nesting'>
            <LabeledValue label='Depth'>
              {depth}
            </LabeledValue>
          </Tooltip>

          <ul className={`${block}__category-list`}>
            {categories.map(category =>
              <Tooltip content={`${perCategorySummary[category].calls} ${category} spans at a total self time of ${msZeroDecimalPlaces(perCategorySummary[category].durationSelf)}`}
                       key={category}>
                <li className={`${block}__category`}>
                  <CategoryIcon category={category} />
                  <span className={`${block}__category-call-count`}>
                    {perCategorySummary[category].calls}
                  </span>
                  <span className={`${block}__category-self-time`}>
                    &nbsp;({msZeroDecimalPlaces(perCategorySummary[category].durationSelf)})
                  </span>
                </li>
              </Tooltip>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
