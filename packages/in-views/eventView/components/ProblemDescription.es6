/* eslint-disable react/no-danger */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import addSection from 'in-views/eventView/hocs/addSection';
import { toHtml } from 'in-services/formatters/markdown';

import 'in-views/eventView/components/ProblemDescription.less';

const block = 'in-event-view-event-problem';

export default addSection(function EventProblem({ event }) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion'], ''));

  return (
    <DescriptionList>
      <DescriptionItem title="Detail">
        <DangerousHtmlPresenter className={`${block}__suggestion`} html={fixSuggestion} />
      </DescriptionItem>
    </DescriptionList>
  );
});
