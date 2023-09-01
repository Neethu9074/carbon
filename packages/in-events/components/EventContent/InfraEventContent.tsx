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
import {
  CLOSE_BRACKET,
  FormModelElement,
  OPEN_BRACKET,
  fromBackendModel
} from 'in-components/QueryBuilder/transformation/formModel';
import InfraAlertChartWrapper from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import AnalyzeInfraEventButton from 'in-events/components/AnalyzeInfraEventButton';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import { InfraAlertConfigWithMetadata, TagCatalog, TimeConfig } from 'in-types';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-components/layout/Grid';
import { deepCopy } from 'in-services/util/object';
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

  if (!alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityName = event.getIn(['metadata', 'entityName'], '');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');

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
          <InfraAlertChartWrapper alertConfig={alertConfig} timeConfig={timeConfig} event={event} />
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleScope')}>
            <div className={locals.alertFiltersWrapper}>
              <FilterGrouping
                alertConfig={alertConfig}
                entityLabel={entityLabel}
                entityType={entityType}
                event={event}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

function FilterGrouping({
  alertConfig,
  entityLabel,
  entityType,
  event
}: {
  alertConfig: InfraAlertConfigWithMetadata;
  entityLabel: string;
  entityType: string;
  event: EventOrMap;
}) {
  const tagFilterExpression = alertConfig.tagFilterExpression;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const tagCatalog = useTagCatalog({ ownerType: entityType });
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  // get the groupingTags info from the events, and create a TagFilter expression to generate QB
  const groupingTags = event.getIn(['metadata', 'groupingTags'], []);
  const groupByExpression = deepCopy(EMPTY_EXPRESSION);

  groupingTags?.map((tagValue: string, tagKey: string) => {
    const groups = tagFilter(tagKey, EQUALS, tagValue);
    groupByExpression.elements.push(groups);
  });

  const groupByExpressionModel = removeOpenCloseBrackets(fromBackendModel(groupByExpression));

  return (
    <ScopeConfigPresenter
      tagFilterFormModel={tagFilterFormModel}
      //@ts-expect-error type error for querybuilder
      queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
      scopePath={
        <>
          <InfraScopePath infraName={entityLabel} iconName={getInfraIconType(entityType as string)} />
          <AlertQueryBuilder value={groupByExpressionModel} readOnly />
        </>
      }
    />
  );
}

// If there is only one element for the groupby after passing it to the fromBackendModel function, OPEN_BRACKET and CLOSE_BRACKET are added to the grouping, so this function removes those brackets.

function removeOpenCloseBrackets(groupByExpression: FormModelElement[]): FormModelElement[] {
  const expression: FormModelElement[] = [];
  groupByExpression.map((element: FormModelElement) => {
    if (element.type != OPEN_BRACKET && element.type != CLOSE_BRACKET) {
      expression.push(element);
    }
  });
  return expression;
}
