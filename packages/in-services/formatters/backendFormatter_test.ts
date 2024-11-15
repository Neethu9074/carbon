/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { expect } from 'chai';

import { getFormatter, getUiMetricsValueByBackendType } from 'in-services/formatters/backendFormatter';

describe('in-services/formatters/backendFormatter', () => {
  it('should match ui metric value', () => {
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

    uiFormatter = getUiMetricsValueByBackendType('PERCENTAGE_100');
    expect(uiFormatter).to.equal('percentagePlain.detailed');
  });

  it('should return default when value is undefined', () => {
    const uiFormatter = getUiMetricsValueByBackendType(undefined);
    expect(uiFormatter).to.equal('number.detailed');
  });

  it('should format percentage metrics appropriately', () => {
    let formatter = getFormatter('PERCENTAGE_100');
    expect(formatter(1)).to.equal('1.00%');

    formatter = getFormatter('PERCENTAGE_100');
    expect(formatter(25)).to.equal('25.00%');

    formatter = getFormatter('PERCENTAGE');
    expect(formatter(1)).to.equal('100.00%');

    formatter = getFormatter('PERCENTAGE');
    expect(formatter(0.25)).to.equal('25.00%');
  });

  it('should format micros metrics appropriately', () => {
    let formatter = getFormatter('MICROS');
    expect(formatter(1)).to.equal('1µs');
    expect(formatter(1000)).to.equal('1ms');
  });

  it('should format nanos metrics appropriately', () => {
    let formatter = getFormatter('NANOS');
    expect(formatter(1)).to.equal('1ns');
    expect(formatter(1000)).to.equal('1µs');
  });

  it('should format rate metrics appropriately', () => {
    let formatter = getFormatter('RATE');
    expect(formatter(1)).to.equal('1.00/s');
    expect(formatter(1000)).to.equal('1,000.00/s');
  });
});
