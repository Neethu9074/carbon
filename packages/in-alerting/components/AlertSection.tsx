/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ReactNode } from 'react';

import { themes } from '@instana/design-tokens';

import Section from 'in-components/workspace/Section';

interface AlertSectionProps {
  children: ReactNode;
  title: ReactNode;
  useAlternateBg?: boolean;
  actions?: ReactNode;
  icon?: string;
  iconColor?: string;
  titleHtmlFor?: string;
  hasError?: boolean;
}

export default function AlertSection({
  title,
  titleHtmlFor,
  hasError,
  icon,
  children,
  actions,
  useAlternateBg,
  iconColor
}: AlertSectionProps) {
  return (
    <Section
      titleHtmlFor={titleHtmlFor}
      title={title}
      hasError={hasError}
      icon={icon}
      actions={actions}
      useAlternateBg={useAlternateBg}
      iconColor={iconColor ?? themes.default.ids.color.option.neutral['600']}
    >
      {children}
    </Section>
  );
}
