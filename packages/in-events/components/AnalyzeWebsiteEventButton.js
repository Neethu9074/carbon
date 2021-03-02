/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import { fromBackendModel, joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { websitesAlertingEventDetailsGoToAnalyze } from 'in-websites/alerting/tracker';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { defaultGroupings } from 'in-websites/tags';
import Button from 'in-new-components/Button';

export default function AnalyzeWebsiteEventButton({ alertConfig, websiteName, timeConfig }) {
  const { rule, tagFilterExpression } = alertConfig;
  const { alertType, metricName } = rule;

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType();
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <Button
      kind="primary"
      icon={getIcon(alertType)}
      onClick={() => websitesAlertingEventDetailsGoToAnalyze({ beaconType })}
      href$={getLinkToAnalyze({
        beaconType,
        formModel: joinExpressions({
          expressions: [
            [tagFilter('beacon.website.name', 'EQUALS', websiteName)],
            tagFilterFormModel,
            blueprintConfig.getRuleTagFilterFormModel(rule),
            blueprintConfig.getExtraAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig)
          ]
        }),
        groupBy: getGrouping(alertType, metricName),
        timeConfig
      })}
    >
      {getLinkTitle(alertType, metricName)}
    </Button>
  );
}

AnalyzeWebsiteEventButton.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  websiteName: PropTypes.string.isRequired,
  timeConfig: propTypeTimeConfig.isRequired
};

function getGrouping(alertType, metricName) {
  switch (alertType) {
    case 'specificJsError':
      return defaultGroupings.error;
    case 'statusCode':
      return defaultGroupings.httpRequest;
    case 'throughput':
      return metricName === 'pageLoads' ? defaultGroupings.pageLoad : defaultGroupings.pageChange;
    case 'slowness':
      return defaultGroupings.none;
    default:
      throw Error('Unsupported alert type');
  }
}

function getIcon(alertType) {
  switch (alertType) {
    case 'specificJsError':
      return 'lib_website_error';
    case 'statusCode':
      return 'lib_website_ajax';
    case 'throughput':
      return 'lib_website_page_load';
    case 'slowness':
      return 'lib_website_page_load';
    default:
      throw Error('Unsupported alert type');
  }
}

function getLinkTitle(alertType, metricName) {
  switch (alertType) {
    case 'specificJsError':
      return 'Analyze JS Errors';
    case 'statusCode':
      return t('in-events:titleAnalyzeHTTPRequests');
    case 'throughput':
      return metricName === 'pageLoads'
        ? t('in-events:titleAnalyzePageLoads')
        : t('in-events:titleAnalyzePageTransitions');
    case 'slowness':
      return 'Analyze Load Time';
    default:
      throw Error('Unsupported alert type');
  }
}
