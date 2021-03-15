/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export default function getLabel(span) {
  const subject = span.getIn(['data', 'nats', 'subject']);
  const sort = span.getIn(['data', 'nats', 'sort']);
  return sort === 'consume'
    ? t('in-forge:tracing.nats.consumeFromSubject', { subjectVar: subject })
    : t('in-forge:tracing.nats.publishToSubject', { subjectVar: subject });
}
