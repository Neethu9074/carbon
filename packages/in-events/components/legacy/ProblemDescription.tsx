/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';
import { t } from 'in-i18n';

import 'in-events/components/legacy/ProblemDescription.less';

const block = 'in-event-view-event-problem';

interface Props {
  fixSuggestion: string;
  className?: string;
}

export default function ProblemDescription({ fixSuggestion, className }: Props) {
  const htmlFixSuggestion = toHtml(fixSuggestion);
  return (
    <DescriptionList className={classNames(block, className)}>
      <DescriptionItem title={t('in-events:titleDescription')}>
        <DangerousHtmlPresenter className={`${block}__suggestion`} html={htmlFixSuggestion} />
      </DescriptionItem>
    </DescriptionList>
  );
}
