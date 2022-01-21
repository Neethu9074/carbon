/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ForwardedRef, forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

import Input, { InputProps } from 'in-components/form/Input/Input';
import Section from 'in-components/workspace/Section';

import locals from './InputInSection.mless';

export default forwardRef<HTMLInputElement, InputInSectionProps>(InputInSection);

interface InputInSectionProps extends InputProps {
  label: string;
  additionalContent?: ReactNode;
  actions?: ReactNode;
}

function InputInSection(
  { label, additionalContent, actions, ...inputProps }: InputInSectionProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { id, hasError } = inputProps;

  if (actions) {
    actions = <div className={locals.actions}>{actions}</div>;
  }

  return (
    <Section titleHtmlFor={id} title={label} hasError={hasError} actions={actions}>
      <Input {...inputProps} className={classNames(inputProps.className, locals.input)} ref={ref} />
      {additionalContent}
    </Section>
  );
}
