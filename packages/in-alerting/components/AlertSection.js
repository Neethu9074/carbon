/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import Section from 'in-components/workspace/Section';
import theme from 'in-themes';

export default function AlertSection({
  title,
  titleHtmlFor,
  hasError,
  icon,
  children,
  actions,
  useAlternateBg,
  iconColor = theme.lib.colors.N600Light
}) {
  return (
    <Section
      titleHtmlFor={titleHtmlFor}
      title={title}
      hasError={hasError}
      icon={icon}
      actions={actions}
      useAlternateBg={useAlternateBg}
      iconColor={iconColor}
    >
      {children}
    </Section>
  );
}
