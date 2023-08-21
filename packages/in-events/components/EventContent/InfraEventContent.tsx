/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card } from '@instana/components';

import {
  alertingEventDetailsChartTimeframe as minDurationMillis,
  alertingDialogItemPickerTimeframe as maxDurationMillis
} from 'in-alerting/components/constants';
import InfraAlertChartWrapper from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import AnalyzeInfraEventButton from 'in-events/components/AnalyzeInfraEventButton';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-components/layout/Grid';
import { TagCatalog, TimeConfig } from 'in-types';
import PluginIcon from 'in-components/PluginIcon';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from './InfraEventContent.mless';

interface Props {
  event: EventOrMap;
}

export default function InfraEventContent({ event }: Props) {
  const alertConfig = useInfraEventAlertConfig(event);

  const entityType = alertConfig?.rule?.entityType ?? 'all';
  const tagCatalog = useTagCatalog({ ownerType: entityType });

  if (!alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityName = event.getIn(['metadata', 'entityName'], '');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');

  const tagFilterExpression = alertConfig.tagFilterExpression;
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);

  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  } as TimeConfig;

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <HorizontalFlexWrapper>
              <PluginIcon className={locals.icon} size="s" plugin={entityType as string} />
              {t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', { entityName: entityName })}
            </HorizontalFlexWrapper>

            <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />

            {hasInfrastructureAnalyzeAccess && (
              <DescriptionButtons>
                <AnalyzeInfraEventButton
                  alertConfig={alertConfig}
                  timeConfig={getSmartAlertAnalyzeTimeConfig(event as EventOrMap, alertConfig)}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <InfraAlertChartWrapper alertConfig={alertConfig} timeConfig={timeConfig} />
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleScope')}>
            <div className={locals.alertFiltersWrapper}>
              <ScopeConfigPresenter
                tagFilterFormModel={tagFilterFormModel}
                //@ts-expect-error type error for querybuilder
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={<InfraScopePath infraName={entityLabel} iconName={getInfraIconType(entityType as string)} />}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
