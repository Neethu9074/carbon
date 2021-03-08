/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function FTPSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.ftp.titleHost')}>{span.getIn(['data', 'ftp', 'host'])}</Di>
        <Di title={t('in-forge:tracing.ftp.titlePort')}>{span.getIn(['data', 'ftp', 'port'])}</Di>
        <Di title={t('in-forge:tracing.ftp.titleCommand')}>{span.getIn(['data', 'ftp', 'command'])}</Di>
        <Di title={t('in-forge:tracing.ftp.titleType')}>{span.getIn(['data', 'ftp', 'type'])}</Di>
        <Di title={t('in-forge:tracing.ftp.titleFile')}>{span.getIn(['data', 'ftp', 'file'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'ftp', 'error'])} />
      </Dl>
    </div>
  );
}
