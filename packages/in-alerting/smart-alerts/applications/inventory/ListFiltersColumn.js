/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertQueryBuilder from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import IconLabel from 'in-alerting/components/IconLabel';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './ListColumns.mless';

export default function ListFiltersColumn({
  tagFilterExpression: backendModelTagFilterExpression = [],
  applicationName
}) {
  const tagFilterExpression = fromBackendModel(backendModelTagFilterExpression);
  const filterCount = getFiltersCount(tagFilterExpression);

  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay);

  return (
    <div className={locals.filters}>
      {applicationName && (
        <span className={locals.space}>
          <IconLabel text={applicationName} type="lib_application" noBottomMargin />
        </span>
      )}
      {tagFilterExpression.length > 0 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <AlertQueryBuilder value={filtersToDisplay} readOnly />
              <span className={locals.moreFilters}>
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
            text={t('in-applications:alert.filter', {
              count: filterCount
            })}
            type="lib_actions_filter"
            noBottomMargin
          />
        </Tooltip>
      )}
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
  /**
   * Not needed in global smart alerts
   */
  applicationName: PropTypes.string,
  tagFilterExpression: PropTypes.object.isRequired
};
