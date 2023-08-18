/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { expect } from 'chai';

import { getBackendTypeKeyByUiMetric, getUiMetricsValueByBackendType } from 'in-services/formatters/backendFormatter';

describe('getBackendTypeKeyByUiMetric', () => {
  it('should mathc ui metric value', () => {
    let backendType = getBackendTypeKeyByUiMetric('number.compact');
    expect(backendType).to.equal('NUMBER');

    backendType = getBackendTypeKeyByUiMetric('perSecond.detailed');
    expect(backendType).to.equal('RATE');

    backendType = getBackendTypeKeyByUiMetric('percentage.detailed');
    expect(backendType).to.equal('PERCENTAGE');

    backendType = getBackendTypeKeyByUiMetric('bytes.detailed');
    expect(backendType).to.equal('BYTES');

    backendType = getBackendTypeKeyByUiMetric('latency.detailed');
    expect(backendType).to.equal('LATENCY');

    backendType = getBackendTypeKeyByUiMetric('millis.compact');
    expect(backendType).to.equal('MILLIS');

    backendType = getBackendTypeKeyByUiMetric('seconds.fixedCompact');
    expect(backendType).to.equal('SECONDS');
  });

  it('should return default when value is empty', () => {
    const backendType = getBackendTypeKeyByUiMetric('');
    expect(backendType).to.equal('NUMBER');
  });

  it('should return default when value is undefined', () => {
    const backendType = getBackendTypeKeyByUiMetric(undefined);
    expect(backendType).to.equal('NUMBER');
  });

  it('should return the correct backend type when value is not present in the mapping', () => {
    const backendType = getBackendTypeKeyByUiMetric('percentage.compact');
    expect(backendType).to.equal('PERCENTAGE');
  });
});

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
