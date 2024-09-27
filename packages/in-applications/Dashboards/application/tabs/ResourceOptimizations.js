/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useResourceOptimization, useTurboRecommendedActions } from 'in-automation/AutomationCard/useScoredActions';
import RecommendedOptimizations from 'in-automation/ResourceOptimization/RecommendedOptimizations';

export default function ResourceOptimizationTab({ applicationId }) {
  const recommendedOptimizations = useResourceOptimization({ applicationId });
  const turboRecommendedActions = useTurboRecommendedActions(recommendedOptimizations);
  return (
    <RecommendedOptimizations
      recommendedActions={turboRecommendedActions}
      totalRecommendedActions={recommendedOptimizations?.data?.totalRecommendedActionsCount}
    />
  );
}
