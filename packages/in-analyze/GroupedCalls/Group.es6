import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import {
  groupBy as groupByMatrixParameter,
  applicationFilter as applicationFilterMatrixParameter
} from 'in-analyze/navigation/matrix';
import { number, millis, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { createFilter } from 'in-analyze/CallsList/filterBuilder';
import { isQueryBuilderEnabled } from 'in-services/featureFlags';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import Button from 'in-new-components/Button';

import locals from './Group.mless';

export default function Group({ item, filters, onChangeFilters, dotColor }) {
  return (
    <Fragment>
      <Tr size="compact">
        <Td className={locals.labelCell}>
          <div className={locals.cell}>
            <span className={locals.dot}>
              {dotColor ? (
                <div className={locals.rect} style={{ background: dotColor }} />
              ) : (
                <span className={locals.rectPlaceHolder} />
              )}
            </span>
            {isQueryBuilderEnabled && (
              <Fragment>
                <span className={locals.groupLabel}>{item.name}</span>
                <Button
                  size="compact"
                  className={locals.filterButton}
                  onClick={() => {
                    if (!isQueryBuilderEnabled) {
                      return;
                    }

                    const group = filters.get('group');
                    const currentGroupValue = group.get('value') ? `${group.get('value')}=${item.name}` : item.name;
                    const applicationFilter = filters.get(applicationFilterMatrixParameter).toJS();
                    const newState = {};
                    newState[applicationFilterMatrixParameter] = applicationFilter;

                    if (group.get('name') === APPLICATION.name) {
                      applicationFilter[APPLICATION.id] = APPLICATION.createFilter(item.name);
                    } else if (group.get('name') === SERVICE.name) {
                      applicationFilter[SERVICE.id] = SERVICE.createFilter(item.name);
                    } else if (group.get('name') === ENDPOINT.name) {
                      applicationFilter[ENDPOINT.id] = ENDPOINT.createFilter(item.name);
                    } else {
                      const tagFilter = filters.get('tagFilter');

                      for (let i = 0; i < tagFilter.size; i++) {
                        const filter = tagFilter.get(i);
                        if (filter.get('name') === group.get('name') && filter.get('value') === currentGroupValue) {
                          // dont add filter twice if they have the same name and value
                          return;
                        }
                      }

                      newState.tagFilter = tagFilter
                        .push(fromJS(createFilter({ name: group.get('name'), value: currentGroupValue })))
                        .toJS();
                    }

                    newState[groupByMatrixParameter] = null;
                    onChangeFilters(newState);
                  }}
                >
                  Filter by
                </Button>
              </Fragment>
            )}
            {!isQueryBuilderEnabled && (
              <Link href$={getLinkToAnalyze({ traceGroupName: item.name, raw: true })}>{item.name}</Link>
            )}
          </div>
        </Td>

        <Td>{number.compact(get(item, ['metrics', 'calls', 0, 1]))}</Td>

        <Td>{formatDateTime(item.timestamp)}</Td>

        <Td>
          <span className={locals.metricValue}>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</span>
        </Td>

        <Td>{percentageTwoDecimalPlaces(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
    </Fragment>
  );
}
