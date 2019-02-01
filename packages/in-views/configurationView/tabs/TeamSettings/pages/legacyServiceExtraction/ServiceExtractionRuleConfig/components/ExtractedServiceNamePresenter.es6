import React from 'react';

import { createFormatter } from 'in-services/formatters/string';

import './ExtractedServiceNamePresenter.less';

const block = 'in-config-generic-ex-rule-service-name-presenter';

export default function ExtractedServiceNamePresenter({ ruleForm, matches }) {
  const isMatching = Object.keys(matches).reduce((agg, matchKey) => agg && matches[matchKey] != null, true);
  if (!isMatching) {
    return <Failed>All expressions must match in order for a service to be defined.</Failed>;
  }

  const formatter = Object.keys(matches).reduce(
    (parentFormatter, key) => {
      const keyMatches = matches[key];
      const keyFormatter = createFormatter(key);
      return formatString => keyFormatter(parentFormatter(formatString), keyMatches);
    },
    s => s
  );
  const serviceName = formatter(ruleForm.get('label').value);

  if (serviceName.trim().length === 0) {
    return <Failed>Empty service name extracted. An empty service name is not supported.</Failed>;
  }

  if (hasRemainingPlaceholders(serviceName)) {
    return (
      <Failed>
        Service could not be extracted because not all placeholders could be replaced: <code>{serviceName}</code>
      </Failed>
    );
  }

  return <Success>{serviceName}</Success>;
}

function hasRemainingPlaceholders(str) {
  return /\{[^}]+\}/.test(str);
}

function Success({ children }) {
  return (
    <Wrapper>
      <div className={`${block}__content`}>{children}</div>
    </Wrapper>
  );
}

function Failed({ children }) {
  return (
    <Wrapper>
      <div className={`${block}__content ${block}__content--failed-extraction`}>{children}</div>
    </Wrapper>
  );
}

function Wrapper({ children }) {
  return (
    <div className={block}>
      <span className={`${block}__header`}>Extracted Service</span>
      {children}
    </div>
  );
}
