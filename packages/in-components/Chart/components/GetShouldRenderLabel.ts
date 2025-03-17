/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { Facets } from 'in-components/AnalyzeView/StateManagement';
import { RenderAxis } from 'in-components/Chart/renderer/types';

export function getShouldRenderLabel(formModel: FormModelElement[], facets: Facets, axis: RenderAxis, i: number) {
  const hasFormData = formModel?.length > 0;
  const hasFacets = Object.keys(facets || {}).length > 0;
  const hasAnyInputs = hasFormData || hasFacets;

  const metricValues = axis?.metrics?.[i] || [];
  const metricSum = metricValues.reduce((total, current) => total + current[1], 0);
  const hasNonZeroMetrics = metricSum !== 0;

  return hasAnyInputs ? hasNonZeroMetrics : true;
}
