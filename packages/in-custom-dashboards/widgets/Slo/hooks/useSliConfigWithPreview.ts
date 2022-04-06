/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import useSliConfiguration from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration';
import { SliConfigurationWithLastUpdated, TimeConfig } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { days } from 'in-services/time/time';

function applyPreviewOverrides(
  sliConfig: SliConfigurationWithLastUpdated,
  timeConfig: TimeConfig,
  isPreview?: boolean
): SliConfigurationWithLastUpdated {
  if (!isPreview) return sliConfig;

  const { initialEvaluationTimestamp } = sliConfig;
  const previewStart = (timeConfig.to ?? Date.now()) - days.toMillis(7);
  const min = Math.min(initialEvaluationTimestamp, previewStart);
  return { ...sliConfig, initialEvaluationTimestamp: min };
}

export default function useSliConfigWithPreview(
  sliConfigId: string,
  timeConfig: TimeConfig,
  isPreview?: boolean
): FetchedState<SliConfigurationWithLastUpdated> {
  const [sliConfiguration, status, ...rest] = useSliConfiguration(sliConfigId);
  if (status !== 'resolved') return [undefined, status, ...rest];

  const sliConfigWithPreview = applyPreviewOverrides(sliConfiguration!, timeConfig, isPreview);
  return [sliConfigWithPreview, status, ...rest];
}
