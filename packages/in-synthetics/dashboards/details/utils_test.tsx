/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { themes } from '@instana/design-tokens';

import { getStatusKPICard } from 'in-synthetics/dashboards/details/utils';

// Assisted by WCA for GP
// Latest GenAI contribution: granite-20B-code-instruct-v2 model

/**
 * Tests the getStatusKPICard function to ensure that it returns a KpiCard component with the correct status text and color based on the provided status code.
 */
describe('getStatusKPICard', () => {
  it('returns a KpiCard component with the correct status text and color for a successful test run', () => {
    const status = 1;
    const expectedText = 'Successful';
    const expectedColor = themes.default.ids.color.option.green['500'];
    const KpiCard = getStatusKPICard(status);
    expect(KpiCard.props.value).toBe(expectedText);
    expect(KpiCard.props.color).toBe(expectedColor);
  });

  it('returns a KpiCard component with the correct status text and color for a failed test run', () => {
    const status = 2;
    const expectedText = 'Failed';
    const expectedColor = themes.default.ids.color.option.red['500'];
    const KpiCard = getStatusKPICard(status);
    expect(KpiCard.props.value).toBe(expectedText);
    expect(KpiCard.props.color).toBe(expectedColor);
  });
});
