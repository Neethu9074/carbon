/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexConfiguration, TagCatalog } from '@instana/types';

import useLinkToUnboundedAnalytics from 'in-custom-dashboards/widgets/Apdex/hooks/useLinkToUnboundedAnalytics';
import { ContextMenuConfig } from 'in-components/Chart/types';
import { t } from 'in-i18n';

interface Props {
  apdexConfig?: ApdexConfiguration;
  tagCatalog?: TagCatalog;
}

export default function useApdexWidgetContextMenu({ apdexConfig, tagCatalog }: Props): Partial<ContextMenuConfig> {
  const linkToUnboundedAnalytics = useLinkToUnboundedAnalytics({ apdexConfig, tagCatalog });

  if (!apdexConfig) {
    return {};
  }

  return {
    primaryContextMenuAction: 'analyze',
    additionalContextMenuButtons: [
      {
        name: 'analyze',
        icon: 'lib_analyze',
        label: t('in-custom-dashboards:widgets.apdex.chart.viewInAnalyze'),
        allowClickPropagationAndDefault: true,
        getHref$: linkToUnboundedAnalytics
      }
    ]
  };
}
