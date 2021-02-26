/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    metric: 'nodeCount',
    label: t('in-forge:plugins.cloudFoundry.labelNodes'),
    min: 0,
    formatter: siPrefix
  }
];
