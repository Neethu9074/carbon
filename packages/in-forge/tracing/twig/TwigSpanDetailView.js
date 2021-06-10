/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SymfonySpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.twig.templateName')}>{span.getIn(['data', 'twig', 'name'])}</Di>
        <Di title={t('in-forge:tracing.twig.templatePath')}>{span.getIn(['data', 'twig', 'path'])}</Di>
        <Di title={t('in-forge:tracing.twig.subtemplateCount')}>{span.getIn(['data', 'twig', 'subtemplate_count'])}</Di>
      </Dl>
    </div>
  );
}
