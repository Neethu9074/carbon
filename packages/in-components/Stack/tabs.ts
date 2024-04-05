/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export default [
  {
    icon: 'lib_application_invert',
    text: t('in-components:stack.tabsLabelApplication'),
    key: 'application',
    emptyMessage: t('in-components:stack.tabsEmptyMessageApplication')
  },
  {
    icon: 'lib_kubernetes_inverted',
    text: t('in-components:stack.tabsLabelKubernetes'),
    key: 'kubernetes',
    emptyMessage: t('in-components:stack.tabsEmptyMessageKubernetes')
  },
  {
    icon: 'lib_infrastructure_inverted',
    text: t('in-components:stack.tabsLabelInfrastructure'),
    key: 'infrastructure',
    emptyMessage: t('in-components:stack.tabsEmptyMessageInfrastructure')
  }
];
