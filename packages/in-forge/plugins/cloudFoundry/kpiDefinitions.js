/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { siPrefix } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.cloudFoundry.labelNodes'),
    metric: 'nodeCount',
    formatter: siPrefix.compact
  }
];
