/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import useSliConfiguration from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration';
import { SliConfigurationWithLastUpdated } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { days } from 'in-services/time/time';

function applyPreviewOverrides(
  sliConfig: SliConfigurationWithLastUpdated,
  isPreview?: boolean
): SliConfigurationWithLastUpdated {
  if (!isPreview) return sliConfig;

  const { initialEvaluationTimestamp } = sliConfig;
  const newSliStartTimestamp = Date.now() - days.toMillis(7);
  const previewStartTimestamp = Math.min(initialEvaluationTimestamp, newSliStartTimestamp);
  return { ...sliConfig, initialEvaluationTimestamp: previewStartTimestamp };
}

export default function useSliConfigWithPreview(
  sliConfigId: string,
  isPreview?: boolean
): FetchedState<SliConfigurationWithLastUpdated> {
  const [sliConfiguration, status, ...rest] = useSliConfiguration(sliConfigId);
  if (status !== 'resolved') return [undefined, status, ...rest];

  const sliConfigWithPreview = applyPreviewOverrides(sliConfiguration!, isPreview);
  return [sliConfigWithPreview, status, ...rest];
}
