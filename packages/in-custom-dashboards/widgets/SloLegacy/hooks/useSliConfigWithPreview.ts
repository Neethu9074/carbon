/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { SliConfigurationWithLastUpdated } from '@instana/types';

import useSliConfiguration from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration';
import { sloFullEnabled } from 'in-services/featureFlags';
import { FetchedState } from 'in-hooks/utils/types';
import { days } from 'in-services/time/time';

function applyPreviewOverrides(
  sliConfig: SliConfigurationWithLastUpdated,
  isPreview?: boolean
): SliConfigurationWithLastUpdated {
  if (!isPreview) return sliConfig;

  const { initialEvaluationTimestamp, lastUpdated } = sliConfig;
  const newSliStartTimestamp = Date.now() - days.toMillis(7);
  const initialTimestamp = sloFullEnabled ? lastUpdated : initialEvaluationTimestamp;
  const previewStartTimestamp = Math.min(initialTimestamp, newSliStartTimestamp);
  return { ...sliConfig, initialEvaluationTimestamp: previewStartTimestamp, lastUpdated: previewStartTimestamp };
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
