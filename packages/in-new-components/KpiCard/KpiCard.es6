import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './KpiCard.mless';

export default function KpiCard({ title, value, raw = false, renderValue, valuesClassName }) {
  if (raw || renderValue) {
    return (
      <div className={locals.wrapper}>
        <div className={locals.title}>{title}</div>
        <span className={joinClassNames(locals.minor, valuesClassName)}>
          {renderValue ? renderValue(value) : value}
        </span>
      </div>
    );
  }

  let major = '––';
  let minor = null;

  if (value != null) {
    const match = String(value).match(/^([0-9\,.]+)(.*)$/);
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
      <span className={locals.major}>{major}</span>
      {minor && <span className={locals.minor}>{minor}</span>}
    </div>
  );
}
