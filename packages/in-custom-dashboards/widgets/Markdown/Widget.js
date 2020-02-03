import { compose, setPropTypes } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';
import { sanitize } from 'in-services/formatters/html';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

export default compose(
  setPropTypes({
    title: rpt.string.isRequired,
    config: rpt.string.isRequired
  }),
  connectTo(({ config: markdown }) => ({
    html: sanitize(toHtml(markdown || ''))
  }))
)(MarkdownWidget);

function MarkdownWidget({ title, html }) {
  return (
    <Card title={title} useMaxAvailableHeight>
      <DangerousHtmlPresenter html={html} />
    </Card>
  );
}
