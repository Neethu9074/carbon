/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function WordpressSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.wordpress.action')}>{span.getIn(['data', 'wp', 'action'])}</Di>
        <Di title={t('in-forge:tracing.wordpress.template')}>{span.getIn(['data', 'wp', 'view'])}</Di>
        <Di title={t('in-forge:tracing.wordpress.postTitle')}>{span.getIn(['data', 'wp', 'post_title'])}</Di>
      </Dl>
    </div>
  );
}
