/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import PropTypes from 'prop-types';
import React from 'react';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import AlertQueryBuilder from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import getApplication from 'in-subscription/application/getApplication';
import IconLabel from 'in-alerting/components/IconLabel';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './ListColumns.mless';

export default function ListFiltersColumn({
  tagFilterExpression: backendModelTagFilterExpression = [],
  applications,
  isGlobalSmartAlertConfig
}) {
  const tagFilterExpression = fromBackendModel(backendModelTagFilterExpression);
  const filterCount = getFiltersCount(tagFilterExpression);

  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay);

  return (
    <div className={locals.filters}>
      {!isGlobalSmartAlertConfig ? (
        <IndividualAlertsSelectionLabel applications={applications} />
      ) : (
        <GlobalAlertsSelectionLabel applications={applications} />
      )}
      {tagFilterExpression.length > 0 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <AlertQueryBuilder value={filtersToDisplay} readOnly />
              <span className={locals.moreItems}>
                {filterCount > maxFilterToDisplay &&
                  t('in-applications:alert.tooltipMoreFilter', {
                    count: filterCount,
                    moreFilterCount: filterCount - maxFilterToDisplay
                  })}
              </span>
            </div>
          }
          align="topMiddle"
          delay={500}
        >
          <IconLabel
            text={t('in-alerting:smartAlerts.applications.inventory.labelAlertFilters')}
            type="lib_actions_filter"
            noBottomMargin
          />
        </Tooltip>
      )}
    </div>
  );
}

function IndividualAlertsSelectionLabel({ applications }) {
  const { applicationId } = Object.values(applications)[0];

  const { label } =
    useObservable(() => getApplication({ id: applicationId }).map(({ data }) => data ?? ''), [applicationId]) ?? {};

  return label ? (
    <span className={locals.bigSpace}>
      <IconLabel text={label} type="lib_application" noBottomMargin />
    </span>
  ) : null;
}

function GlobalAlertsSelectionLabel({ applications }) {
  const applicationIds = Object.values(applications);

  return (
    <div className={locals.bigSpace}>
      <IconLabel
        text={t('in-alerting:smartAlerts.applications.inventory.numberOfApplicationsSelected', {
          numberApplicationsSelected: applicationIds.length
        })}
        type="lib_application"
        noBottomMargin
      />
    </div>
  );
}

function getFiltersCount(tagFilterExpression) {
  return tagFilterExpression.reduce((count, element) => {
    return element.type === 'TAG_FILTER' ? count + 1 : count;
  }, 0);
}

function getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay) {
  const filtersToDisplay = [];
  let tagFilterCount = 0;

  for (const item of tagFilterExpression) {
    if (tagFilterCount === maxFilterToDisplay) {
      break;
    }
    filtersToDisplay.push(item);

    if (item.type === 'TAG_FILTER') {
      tagFilterCount++;
    }
  }

  return filtersToDisplay;
}

ListFiltersColumn.propTypes = {
  tagFilterExpression: PropTypes.object.isRequired,
  applications: applicationsItemTreePropType.isRequired,
  isGlobalSmartAlertConfig: PropTypes.bool
};
