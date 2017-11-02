import React from 'react';

import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import { getEumSnippet } from 'in-services/eum';
import Code from 'in-components/Code';

import './NoTransitionsConfigured.less';

const block = 'in-eum-no-transitions';

export default function NoTransitionsConfigured({ snapshot }) {
  const snippet = getEumSnippet({
    key: snapshot.getIn(['data', 'eumKey']),
    additionalScript: `
// set the name of a page on which this load/errors/calls happened
// ineum('page', 'product-details');`
  });
  return (
    <div className={block}>
      <FullscreenViewHeading iconType="globe">Transitions</FullscreenViewHeading>

      <p>
        No transitions are currently being monitored. Transitions grant you deeper insights into the performance of your
        SPA. This is helpful to understand which part of your SPA is slow and to track the performance of these parts
        over time. You should try it, it is easy to set up!
      </p>

      <Code code={snippet} lang="html" showLineNumbers={false} wrapperClassName={`${block}__tracking-code`} />
    </div>
  );
}
