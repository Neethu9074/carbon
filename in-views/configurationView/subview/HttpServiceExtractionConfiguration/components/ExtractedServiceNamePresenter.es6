import React from 'react';

import './ExtractedServiceNamePresenter.less';

const block = 'in-config-http-ex-rule-service-name-presenter';

export default function ExtractedServiceNamePresenter({rule, hostMatch, pathMatch, formatter}) {
  let content;

  if (!hostMatch || !pathMatch) {
    content = (
      <div className={`${block}__content ${block}__content--failed-extraction`}>
        The host header and request path regular expressions must both match in order for a{' '}
        service to be extracted.
      </div>
    );
  } else {
    content = (
      <div className={`${block}__content`}>
        {formatter(rule.getIn(['data', 'extract']), hostMatch.slice(1), pathMatch.slice(1))}
      </div>
    );
  }

  return (
    <div className={block}>
      <span className={`${block}__header`}>Extracted Service</span>

      {content}
    </div>
  );
}
