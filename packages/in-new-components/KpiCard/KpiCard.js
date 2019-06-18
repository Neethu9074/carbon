import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { evaluateClassNames } from 'in-services/util/classnames';
import { joinClassNames } from 'in-services/util/classnames';

import locals from './KpiCard.mless';

export default function KpiCard({
  title,
  value,
  raw = false,
  renderValue,
  valuesClassName,
  borderless = false,
  color = false
}) {
  if (raw || renderValue) {
    return (
      <div
        className={evaluateClassNames({
          [locals.wrapper]: true,
          [locals.borderless]: borderless
        })}
      >
        <div className={locals.title}>{title}</div>
        <span className={joinClassNames(locals.minor, valuesClassName)}>
          {renderValue ? renderValue(value) : value}
        </span>
      </div>
    );
  }

  let major = valueMissingPlaceholder;
  let minor = null;

  if (value != null) {
    const match = String(value).match(/^([0-9,.]+)(.*)$/);
    if (!match) {
      major = value;
    } else {
      major = match[1];
      minor = match[2];
    }
  }

  return (
    <div className={locals.wrapper}>
      <div className={locals.title}>{title}</div>
      <span className={locals.major} style={{ color: color }}>
        {major}
      </span>
      {minor && <span className={locals.minor}>{minor}</span>}
    </div>
  );
}
