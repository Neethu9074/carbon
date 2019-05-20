import React from 'react';

import SectionLine from 'in-settings/components/SectionLine';
import Section from 'in-settings/components/Section';

import './Step.less';

const block = 'in-dynamic-rule-dialog-step';

export default function Step({ number, title, children }) {
  return (
    <Section>
      <div className={block}>
        <div className={`${block}__header`}>
          <div className={`${block}__number`}>{number}</div>
          <span className={`${block}__title`}>{title}</span>
        </div>
        <div className={`${block}__content`}>
          <SectionLine />
          {children}
        </div>
      </div>
    </Section>
  );
}
