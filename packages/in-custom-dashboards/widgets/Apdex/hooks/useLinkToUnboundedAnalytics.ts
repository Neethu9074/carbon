/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexConfiguration, TagCatalog, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

import {
  isApplicationApdexConfiguration,
  isWebsiteApdexConfiguration,
  WebsiteApdexConfiguration
} from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import getLinkToWebsiteAnalyze from 'in-custom-dashboards/widgets/Slo/hooks/analytics/getLinkToWebsiteAnalyze';
import { TimeConfigAwareHref$Creator } from 'in-components/Chart/types';

interface Props {
  apdexConfig?: ApdexConfiguration;
  tagCatalog?: TagCatalog;
}

export default function useLinkToUnboundedAnalytics({ apdexConfig, tagCatalog }: Props): TimeConfigAwareHref$Creator {
  if (!apdexConfig || !tagCatalog) {
    return () => just('');
  }

  if (isWebsiteApdexConfiguration(apdexConfig)) {
    return highlightedTime => buildWebsiteApdexUA2Link(apdexConfig, tagCatalog, highlightedTime);
  }

  if (isApplicationApdexConfiguration(apdexConfig)) {
    // application apdex is not yet supported
    return () => just('');
  }

  return () => just('');
}

function buildWebsiteApdexUA2Link(
  apdexConfig: WebsiteApdexConfiguration,
  tagCatalog: TagCatalog,
  highlightedTime: TimeConfig
): ReturnType<TimeConfigAwareHref$Creator> {
  const { apdexEntity } = apdexConfig;
  const { entityId, beaconType, tagFilterExpression } = apdexEntity;
  const metric = {
    metricId: 'beaconDuration',
    aggregationId: 'MEAN'
  } as const;

  return getLinkToWebsiteAnalyze({
    websiteId: entityId,
    beaconType,
    timeConfig: highlightedTime,
    tagCatalog,
    filterExpression: tagFilterExpression,
    chartedMetrics: [metric],
    fields: [{ ...metric, type: 'metric' }]
  });
}
