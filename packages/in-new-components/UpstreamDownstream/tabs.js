/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import { t } from 'in-i18n';

export default [
  {
    icon: 'lib_context_guide_upstream',
    text: t('in-components:upstreamDownstream.tabsUpstream'),
    key: relationships.UPSTREAM
  },
  {
    icon: 'lib_context_guide_downstream',
    text: t('in-components:upstreamDownstream.tabsDownstream'),
    key: relationships.DOWNSTREAM
  }
];
