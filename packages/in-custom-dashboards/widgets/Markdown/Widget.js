/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, setPropTypes } from 'recompose';
import { Card } from '@instana/components';
import rpt from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';
import { sanitize } from 'in-services/formatters/html';
import connectTo from 'in-hoc/connectTo';

import locals from './Widget.mless';

export default compose(
  setPropTypes({
    title: rpt.string.isRequired,
    config: rpt.string.isRequired
  }),
  connectTo(({ config: markdown }) => ({
    html: sanitize(toHtml(markdown || ''))
  }))
)(MarkdownWidget);

function MarkdownWidget({ title, actions, html, isPreview, dragHandle }) {
  return (
    <Card
      title={title}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
      useMaxAvailableHeight={!isPreview}
    >
      <DangerousHtmlPresenter className={locals.markdown} html={html} />
    </Card>
  );
}
