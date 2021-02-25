/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { relationships } from 'in-new-components/UpstreamDownstream/constants';

export default [
  {
    icon: 'lib_context_guide_upstream',
    text: t('in-new-components:upstreamDownstream.tabsUpstream'),
    key: relationships.UPSTREAM
  },
  {
    icon: 'lib_context_guide_downstream',
    text: t('in-new-components:upstreamDownstream.tabsDownstream'),
    key: relationships.DOWNSTREAM
  }
];
