/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import { DescriptionList, DescriptionItem } from '@instana/components';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';

import './ProblemDescription.less';

const block = 'in-event-view-event-problem';

export default function CustomProblemDescription({ text, title }) {
  return (
    <DescriptionList inComponents>
      <DescriptionItem inComponents title={title}>
        <DangerousHtmlPresenter className={`${block}__suggestion`} html={toHtml(text)} />
      </DescriptionItem>
    </DescriptionList>
  );
}

CustomProblemDescription.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
