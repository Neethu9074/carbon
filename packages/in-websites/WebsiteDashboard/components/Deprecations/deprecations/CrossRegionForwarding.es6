import React from 'react';

import Deprecation from 'in-websites/WebsiteDashboard/components/Deprecations/Deprecation';
import { getEumSnippet } from 'in-services/eum';
import Code from 'in-components/Code';

export default function CrossRegionForwarding({ websiteId }) {
  return (
    <Deprecation title="Missing / Wrong Reporting URL" supportedUntil="2019-04-01">
      <p>
        Within the last twelve hours we received data from a JavaScript snippet embedded which is either missing or has
        an incorrect <code>reportingUrl</code> definition. In the future, we cannot guarantee that the JavaScript agent
        will continue to work without a correct <code>reportingUrl</code>.
      </p>
      <p>
        Please correct the JavaScript snippet by defining the <code>reportingUrl</code>. It can be defined next to the
        key definition like the following snippet shows.
      </p>
      <Code code={getEumSnippet({ key: websiteId })} lang="html" showLineNumbers={false} />
    </Deprecation>
  );
}
