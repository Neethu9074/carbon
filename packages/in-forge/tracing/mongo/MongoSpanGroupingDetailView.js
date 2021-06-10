/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function MongoSpanGroupingDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.mongo.titleNamespace')}>{span.getIn(['data', 'mongo', 'namespace'])}</Di>
        <Di title={t('in-forge:tracing.mongo.titleCommand')}>{span.getIn(['data', 'mongo', 'command'])}</Di>
      </Dl>
    </div>
  );
}
