import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import { millis, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { createFilter } from 'in-analyze/CallsList/filterBuilder';
import { isQueryBuilderEnabled } from 'in-services/featureFlags';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';

import locals from './Group.mless';

export default function Group({ item, filters, onChangeFilters, dotColor }) {
  return (
    <Fragment>
      <Tr size="compact">
        <Td>
          <div className={locals.cell}>
            <span className={locals.dot}>
              {dotColor ? (
                <div className={locals.rect} style={{ background: dotColor }} />
              ) : (
                <span className={locals.rectPlaceHolder} />
              )}
            </span>
            {isQueryBuilderEnabled && (
              <span
                className={locals.groupLabel}
                onClick={() => {
                  if (!isQueryBuilderEnabled) {
                    return;
                  }

                  const currentGroupName = filters.getIn(['group', 'technicalName']);
                  const tagFilter = filters.get('tagFilter');

                  for (let i = 0; i < tagFilter.size; i++) {
                    const filter = tagFilter.get(i);
                    if (filter.get('name') === currentGroupName && filter.get('value') === item.name) {
                      // dont add filter twice
                      return;
                    }
                  }

                  const newState = {
                    tagFilter: tagFilter.push(fromJS(createFilter({ name: currentGroupName, value: item.name }))).toJS()
                  };
                  newState[groupByMatrixParameter] = null;

                  onChangeFilters(newState);
                }}
              >
                {item.name}
              </span>
            )}
            {!isQueryBuilderEnabled && (
              <Link href$={getLinkToAnalyze({ traceGroupName: item.name, raw: true })}>{item.name}</Link>
            )}
          </div>
        </Td>

        <Td>{formatDateTime(item.timestamp)}</Td>

        <Td>{get(item, ['metrics', 'calls', 0, 1])}</Td>

        <Td>
          <span className={locals.metricValue}>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</span>
        </Td>

        <Td>{percentageTwoDecimalPlaces(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
    </Fragment>
  );
}
