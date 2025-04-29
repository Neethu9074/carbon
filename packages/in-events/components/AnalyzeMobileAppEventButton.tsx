/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, CarbonMenuItem, SvgIcon } from '@instana/components';

import {
  getBlueprintConfig,
  MetricName,
  MobileAlertType
} from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { fromBackendModel, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { MobileAppSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
// @ts-expect-error Missing exact typings
import { defaultGroupings } from 'in-mobile-apps/tags';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { FixedTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

interface AnalyzeMobileAppEventButtonProps {
  alertConfig: MobileAppSmartAlertConfig;
  mobileAppName: string;
  timeConfig: FixedTimeConfig;
  as?: 'button' | 'menuItem';
}

export default function AnalyzeMobileAppEventButton({
  alertConfig,
  mobileAppName,
  timeConfig,
  as = 'button'
}: AnalyzeMobileAppEventButtonProps) {
  const { navigate } = useNavigation();
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();
  const { rule, tagFilterExpression } = alertConfig;
  const { alertType, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const linkToUA = urlWithoutQueryParameter(
    getLinkToMobileAppAnalyze({
      beaconType,
      timeConfig,
      groupBy: getGrouping(alertType, metricName),
      chartedMetrics: getChartedMetrics(alertType, alertConfig?.rule.aggregation),
      formModel: joinExpressions({
        expressions: [
          [tagFilter('mobileBeacon.mobileApp.name', EQUALS, mobileAppName)],
          tagFilterFormModel,
          blueprintConfig.getRuleTagFilterFormModel(rule),
          blueprintConfig.getExtraAnalyzeLinkTagFilterFormModel(alertConfig, timeConfig)
        ]
      })
    })
  );

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        renderIcon={() => <SvgIcon size="xs" type={getIcon(alertType)} />}
        style={{ outline: '10px red' }}
        label={getLinkTitle(alertType, metricName)}
        onClick={() => {
          navigate(parseUrl(linkToUA, true));
        }}
      />
    );
  }

  return (
    <Button kind="primary" icon={getIcon(alertType)} href={linkToUA} style={{ outline: '10px red' }}>
      {getLinkTitle(alertType, metricName)}
    </Button>
  );
}

function getGrouping(alertType: MobileAlertType, metricName: string) {
  switch (alertType) {
    case 'slowness':
    case 'statusCode':
      return defaultGroupings.httpRequest;
    case 'throughput':
      return metricName === 'sessions' ? defaultGroupings.sessionStart : defaultGroupings.viewChange;
    case 'customEvent':
      return defaultGroupings.custom;
    case 'crash':
      return defaultGroupings.crash;
    default:
      throw Error('Unsupported alert type');
  }
}

function getChartedMetrics(alertType: MobileAlertType, aggregation?: string) {
  switch (alertType) {
    case 'slowness':
      return [
        {
          metricId: 'beaconDuration',
          aggregationId: aggregation ?? 'MEAN'
        }
      ];
    case 'statusCode':
    case 'throughput':
    case 'customEvent':
    case 'crash':
      return [
        {
          metricId: 'beaconCount',
          aggregationId: 'SUM'
        }
      ];
    default:
      throw Error('Unsupported alert type');
  }
}

function getIcon(alertType: MobileAlertType) {
  switch (alertType) {
    case 'slowness':
    case 'statusCode':
      return 'lib_mobile_app_request';
    case 'throughput':
      return 'lib_mobile_app_view';
    case 'customEvent':
      return 'lib_mobile_app_custom_event';
    case 'crash':
      return 'lib_mobile_app_crash';
    default:
      throw Error('Unsupported alert type');
  }
}

function getLinkTitle(alertType: MobileAlertType, metricName: string) {
  switch (alertType) {
    case 'slowness':
    case 'statusCode':
      return t('in-events:titleAnalyzeHTTPRequests');
    case 'throughput':
      return metricName === 'sessions'
        ? t('in-events:titleAnalyzeSessionStarts')
        : t('in-events:titleAnalyzeViewTransitions');
    case 'customEvent':
      return t('in-events:titleAnalyzeCustomEvents');
    case 'crash':
      return t('in-events:titleAnalyzeCrash');
    default:
      throw Error('Unsupported alert type');
  }
}
