/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Card } from '@instana/components';

import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import AgentMonitoringIssueDescription from 'in-events/components/legacy/AgentMonitoringIssueDescription';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import SubEntityInformation from 'in-events/components/legacy/SubEntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { isAgentMonitoringIssueEvent } from 'in-events/components/eventUtil';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

const supportedProblems = {
  'Condition [Ready]: ContainersNotReady': {
    problemText: t('in-events:kubernetesEvent.problemText.podContainerNotReady'),
    fixSuggestion: t('in-events:kubernetesEvent.fixSuggestion.podContainerNotReady')
  }
};

export function isKubernetesEvent(event) {
  return (
    event.getIn(['metadata', 'entityName']) === 'Kubernetes Pod' &&
    event.getIn(['problem', 'problemText']) in supportedProblems
  );
}

export function isKubernetesTitle(title) {
  return title in supportedProblems;
}

export function getKubernetesProblemTextReplacement(text) {
  return isKubernetesTitle(text) ? supportedProblems[text]['problemText'] : '';
}

export function getKubernetesProblemText(event) {
  return isKubernetesEvent(event) ? getKubernetesProblemTextReplacement(event.getIn(['problem', 'problemText'])) : '';
}

export function getKubernetesFixSuggestion(event) {
  return isKubernetesEvent(event)
    ? supportedProblems[event.getIn(['problem', 'problemText'])]['fixSuggestion']
    : event.getIn(['problem', 'fixSuggestion'], '');
}

export function KubernetesEventContent({ event, timeConfig }) {
  const fixSuggestion = getKubernetesFixSuggestion(event);
  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <EntityWithParentInformation
              entityId={event.get('entityId')}
              entityType={event.get('entityType')}
              metadata={event.get('metadata')}
              timeConfig={timeConfig}
              linkTimeConfig={getTimeConfigFromEvent(event)}
            />
            <SubEntityInformation event={event} />
            {isAgentMonitoringIssueEvent(event) ? (
              <AgentMonitoringIssueDescription
                event={event}
                timeConfig={timeConfig}
                className="in-event-view-event-content"
              />
            ) : (
              <ProblemDescription fixSuggestion={fixSuggestion} />
            )}
            <DescriptionButtons>
              <TriggeredIncidentButton event={event} />
              <EventSpecificationLink event={event.toJS()} />
              <AnalyzeIssueCallsButton event={event} />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>
    </>
  );
}
