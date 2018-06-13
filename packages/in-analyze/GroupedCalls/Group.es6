import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import { millis, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { createFilter } from 'in-analyze/CallsList/filterBuilder';
import { isQueryBuilderEnabled } from 'in-services/featureFlags';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import SvgIcon from 'in-components/SvgIcon';

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
            <Link
              href$={!isQueryBuilderEnabled ? getLinkToAnalyze({ traceGroupName: item.name, raw: true }) : null}
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

                onChangeFilters({
                  tagFilter: tagFilter.push(fromJS(createFilter({ name: currentGroupName, value: item.name }))).toJS()
                });
              }}
            >
              {item.name}
            </Link>
          </div>
        </Td>

        <Td>{item.timestamp}</Td>

        <Td>
          <div className={locals.cell}>
            <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={24} height={24} />
            <Link className={locals.serviceLink} href$={getServiceDashboard(item.service.id)}>
              {item.service.label}
            </Link>
          </div>
        </Td>

        <Td>{item.callLabel}</Td>

        <Td>
          <span className={locals.metricValue}>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</span>
        </Td>

        <Td>{percentageTwoDecimalPlaces(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
    </Fragment>
  );
}
