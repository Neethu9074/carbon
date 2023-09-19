/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ReactNode } from 'react';

import Section from 'in-components/workspace/Section';
import { useTheme } from 'in-themes';

interface AlertSectionProps {
  title: ReactNode;
  children: ReactNode;
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
  const theme = useTheme();

  return (
    <Section
      titleHtmlFor={titleHtmlFor}
      title={title}
      hasError={hasError}
      icon={icon}
      actions={actions}
      useAlternateBg={useAlternateBg}
      iconColor={iconColor ?? theme.ids.color.option.neutral['600']}
    >
      {children}
    </Section>
  );
}
