import React from 'react';

import './RuleControl.less';

const block = 'in-dynamic-rule-dialog-control';

export default function RuleControl({ name, nameComponent, helpText, helpComponent, children, form }) {
  return (
    <div className={block}>
      <div className={`${block}__left`}>
        <span className={`${block}__name`}>{name}</span>
        {nameComponent ? nameComponent() : null}

        <span className={`${block}__help-text`}>{helpText}</span>
        {helpComponent ? helpComponent({ form }) : null}
      </div>
      <div className={`${block}__right`}>{children}</div>
    </div>
  );
}
