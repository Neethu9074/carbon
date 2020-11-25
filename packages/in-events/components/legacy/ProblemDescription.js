/* eslint-disable react/no-danger */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';

import 'in-events/components/legacy/ProblemDescription.less';

const block = 'in-event-view-event-problem';

export default function EventProblem({ event }) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion'], ''));

  return (
    <DescriptionList className={block}>
      <DescriptionItem title="Detail">
        <DangerousHtmlPresenter className={`${block}__suggestion`} html={fixSuggestion} />
      </DescriptionItem>
    </DescriptionList>
  );
}
