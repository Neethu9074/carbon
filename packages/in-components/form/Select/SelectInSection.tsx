/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

import Select, { Props as SelectProps } from 'in-components/form/Select';
import Section from 'in-components/workspace/Section';

import locals from './SelectInSection.mless';

interface SelectInSectionProps extends SelectProps {
  label: ReactNode;
  additionalContent?: ReactNode;
  actions?: ReactNode;
  useAlternateBg?: boolean;
  titleWidth?: string;
}

export default forwardRef<HTMLSelectElement, SelectInSectionProps>(function SelectInSection(
  { label, additionalContent, actions, useAlternateBg, titleWidth, ...selectProps }: SelectInSectionProps,
  ref
) {
  const { id, hasError } = selectProps;

  if (actions) {
    actions = <div className={locals.actions}>{actions}</div>;
  }

  return (
    <Section
      titleHtmlFor={id}
      title={label}
      useAlternateBg={useAlternateBg}
      hasError={hasError}
      actions={actions}
      titleWidth={titleWidth}
    >
      <Select {...selectProps} className={classNames(selectProps.className, locals.select)} ref={ref} />
      {additionalContent}
    </Section>
  );
});
