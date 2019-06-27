import PropTypes from 'prop-types';
/* eslint-disable react/no-danger */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import addSection from 'in-views/eventView/hocs/addSection';
import { toHtml } from 'in-services/formatters/markdown';

import 'in-views/eventView/components/ProblemDescription.less';

const block = 'in-event-view-event-problem';

export default addSection(CustomProblemDescription);

function CustomProblemDescription({ text, title }) {
  return (
    <DescriptionList>
      <DescriptionItem title={title}>
        <DangerousHtmlPresenter className={`${block}__suggestion`} html={toHtml(text)} />
      </DescriptionItem>
    </DescriptionList>
  );
}

CustomProblemDescription.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
