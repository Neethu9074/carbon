/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export default [
  {
    value: 'Running',
    label: t('in-kubernetes:running')
  },
  {
    value: 'Pending',
    label: t('in-kubernetes:pending')
  },
  {
    value: 'Succeeded',
    label: t('in-kubernetes:succeeded')
  },
  {
    value: 'Failed',
    label: t('in-kubernetes:failed')
  },
  {
    value: 'Unknown',
    label: t('in-kubernetes:unknown')
  }
];
