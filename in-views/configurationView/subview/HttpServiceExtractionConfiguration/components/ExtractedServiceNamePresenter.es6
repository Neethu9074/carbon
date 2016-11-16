import React from 'react';

import {createFormatter} from 'in-services/formatters/string';

import './ExtractedServiceNamePresenter.less';

const block = 'in-config-http-ex-rule-service-name-presenter';

export default function ExtractedServiceNamePresenter({ruleForm, matches}) {
  const ruleKeys = ruleForm.getItem('matchSpecification').keys();
  const mismatches = ruleKeys.filter(key => !matches[key]);

  let content;
  if (mismatches.length > 0) {
    content = (
      <div className={`${block}__content ${block}__content--failed-extraction`}>
        All expressions must match in order for a service to be defined.
      </div>
    );
  } else {
    const formatter = ruleKeys.reduce((parentFormatter, key) => {
      const keyMatches = matches[key];
      const keyFormatter = createFormatter(`${key}-`);
      return formatString => keyFormatter(parentFormatter(formatString), keyMatches);
    }, s => s);

    content = (
      <div className={`${block}__content`}>
        {formatter(ruleForm.getItem('label').value)}
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
