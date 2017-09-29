import React from 'react';

import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import { getEumSnippet } from 'in-services/eum';
import Code from 'in-components/Code';

import './NoPagesConfigured.less';

const block = 'in-eum-no-pages';

export default function NoPagesConfigured({ snapshot }) {
  const snippet = getEumSnippet({
    key: snapshot.getIn(['data', 'eumKey']),
    additionalScript: `
// set the name of a page on which this load/errors/calls happened
// ineum('page', 'product-details');`
  });
  return (
    <div className={block}>
      <FullscreenViewHeading iconType="globe">Pages</FullscreenViewHeading>

      <p>
        No pages are currently being monitored. Pages grant you deeper insights into the performance of your website.
        This is helpful to understand which part of your website is slow and to track the performance of these parts
        over time. You should try it, it is easy to set up!
      </p>

      <Code code={snippet} lang="html" showLineNumbers={false} wrapperClassName={`${block}__tracking-code`} />
    </div>
  );
}
