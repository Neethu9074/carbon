/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { Header, HeaderName, Theme } from '@carbon/react';
// eslint-disable-next-line no-restricted-imports
import { FullPageError } from '@carbon/ibm-products';
import React from 'react';

export const ErrorPage = props => {
  const { kind, title, label, description, children } = props;

  return (
    <Theme theme="white">
      <Header className="cds--g100" aria-label="Page header">
        <HeaderName href="#" prefix="IBM">
          Instana
        </HeaderName>
      </Header>
      <div className="cds--content">
        <FullPageError title={title} kind={kind} label={label} description={description} aria-label="Content">
          {children}
        </FullPageError>
      </div>
    </Theme>
  );
};
