/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import useApdexConfiguration from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexConfiguration';
import { FetchedState } from 'in-hooks/utils/types';
import { days, hours } from 'in-services/time/time';
import { ApdexConfiguration } from 'in-types';

function applyPreviewOverrides(apdexConfig: ApdexConfiguration, isPreview?: boolean): ApdexConfiguration {
  if (!isPreview) return apdexConfig;

  const { createdAt } = apdexConfig;
  const newApdexStartTimestamp = Date.now() - days.toMillis(7) - hours.toMillis(1);
  const previewStartTimestamp = Math.min(createdAt, newApdexStartTimestamp);
  return { ...apdexConfig, createdAt: previewStartTimestamp };
}

export default function useApdexConfigWithPreview(
  apdexConfigId: string,
  isPreview?: boolean
): FetchedState<ApdexConfiguration> {
  const [apdexConfiguration, status, ...rest] = useApdexConfiguration(apdexConfigId);
  if (status !== 'resolved') return [undefined, status, ...rest];

  const apdexConfigWithPreview = applyPreviewOverrides(apdexConfiguration!, isPreview);
  return [apdexConfigWithPreview, status, ...rest];
}
