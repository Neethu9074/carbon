/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

import { Select, SelectProps } from '@instana/components';

import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';

import locals from './SelectInSection.mless';

interface SelectInSectionProps extends SelectProps {
  label: ReactNode;
  additionalContent?: ReactNode;
  actions?: ReactNode;
  useAlternateBg?: boolean;
  titleWidth?: string;
}

export const SelectInSection = forwardRef<HTMLSelectElement, SelectInSectionProps>(function SelectInSelection(
  { label, additionalContent, actions, useAlternateBg, titleWidth, ...selectProps }: SelectInSectionProps,
  ref
) {
  const { id, hasError } = selectProps;

  if (actions) {
    actions = <div className={locals.actions}>{actions}</div>;
  }

  return (
    <Section titleHtmlFor={id} title={label} hasError={hasError} actions={actions} titleWidth={titleWidth}>
      <Select {...selectProps} className={classNames(selectProps.className, locals.select)} ref={ref} />
      {additionalContent}
    </Section>
  );
});
