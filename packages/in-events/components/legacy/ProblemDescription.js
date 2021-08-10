/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getKubernetesFixSuggestion } from 'in-events/components/EventContent/KubernetesEventContent';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
/* eslint-disable react/no-danger */
import { t } from 'in-i18n';
import { toHtml } from 'in-services/formatters/markdown';

import 'in-events/components/legacy/ProblemDescription.less';

const block = 'in-event-view-event-problem';

export default function EventProblem({ event }) {
  const fixSuggestion = toHtml(getFixSuggestion(event));
  return (
    <DescriptionList className={block}>
      <DescriptionItem title={t('in-events:titleDescription')}>
        <DangerousHtmlPresenter className={`${block}__suggestion`} html={fixSuggestion} />
      </DescriptionItem>
    </DescriptionList>
  );
}

function getFixSuggestion(event) {
  const kubernetesFixSuggestion = getKubernetesFixSuggestion(event);
  if (kubernetesFixSuggestion) {
    return kubernetesFixSuggestion;
  }
  return event.getIn(['problem', 'fixSuggestion'], '');
}
