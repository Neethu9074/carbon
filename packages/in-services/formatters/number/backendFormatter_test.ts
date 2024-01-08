/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { expect } from 'chai';

import { getUiMetricsValueByBackendType } from 'in-services/formatters/backendFormatter';

describe('getUiMetricsValueByBackendType', () => {
  it('should mathc ui metric value', () => {
    let uiFormatter = getUiMetricsValueByBackendType('NUMBER');
    expect(uiFormatter).to.equal('number.compact');

    uiFormatter = getUiMetricsValueByBackendType('RATE');
    expect(uiFormatter).to.equal('perSecond.detailed');

    uiFormatter = getUiMetricsValueByBackendType('PERCENTAGE');
    expect(uiFormatter).to.equal('percentage.detailed');

    uiFormatter = getUiMetricsValueByBackendType('BYTES');
    expect(uiFormatter).to.equal('bytes.detailed');

    uiFormatter = getUiMetricsValueByBackendType('LATENCY');
    expect(uiFormatter).to.equal('latency.detailed');

    uiFormatter = getUiMetricsValueByBackendType('MILLIS');
    expect(uiFormatter).to.equal('millis.compact');

    uiFormatter = getUiMetricsValueByBackendType('SECONDS');
    expect(uiFormatter).to.equal('seconds.fixedCompact');
  });

  it('should return default when value is undefined', () => {
    const uiFormatter = getUiMetricsValueByBackendType(undefined);
    expect(uiFormatter).to.equal('number.detailed');
  });
});
