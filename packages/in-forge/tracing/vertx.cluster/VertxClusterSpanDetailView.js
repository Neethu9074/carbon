/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function VertxClusterSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.vertxCluster.sort')}>{span.getIn(['data', 'vertx', 'cluster', 'sort'])}</Di>
        <Di title={t('in-forge:tracing.vertxCluster.address')}>
          {span.getIn(['data', 'vertx', 'cluster', 'address'])}
        </Di>
      </Dl>
    </div>
  );
}
