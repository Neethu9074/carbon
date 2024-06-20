/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { OptionTypeBase } from 'react-select';
import React, { ReactNode } from 'react';

import { Spacer } from '@instana/components';

import LazyComboBox, { LazyComboBoxProps } from 'in-components/ComboBox/LazyComboBox';
import Section from 'in-components/workspace/Section';
import { Option } from 'in-components/ComboBox';

interface LazyComboBoxInSectionProps<
  Resource,
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false
> extends LazyComboBoxProps<Resource, OptionType, IsMulti> {
  label: ReactNode;
  additionalContent?: ReactNode;
  actions?: ReactNode;
  useAlternateBg?: boolean;
  titleWidth?: string;
  hasError?: boolean;
}

export default function LazyComboBoxInSection<
  Resource,
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false
>({
  label,
  additionalContent,
  actions,
  useAlternateBg,
  titleWidth,
  hasError,
  ...comboBoxProps
}: LazyComboBoxInSectionProps<Resource, OptionType, IsMulti>) {
  const { id } = comboBoxProps;

  if (actions) {
    actions = (
      <>
        <Spacer horizontal="normal" />
        {actions}
      </>
    );
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
      <LazyComboBox {...comboBoxProps} />
      {additionalContent}
    </Section>
  );
}
