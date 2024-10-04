/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  containsExactMatch,
  shouldDisplayConvertedUnits
} from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdForm';

describe('containsExactMatch', () => {
  it('check input contains only numbers', () => {
    expect(containsExactMatch('123')).toBe(true);
    expect(containsExactMatch('123.000')).toBe(true);
    expect(containsExactMatch('1,023.000')).toBe(true);
    expect(containsExactMatch('0')).toBe(true);
  });

  it('check input with the base value unit', () => {
    expect(containsExactMatch('100 B')).toBe(true);
    expect(containsExactMatch('100.000 B')).toBe(true);
    expect(containsExactMatch('100 ms')).toBe(true);
    expect(containsExactMatch('100 GiB')).toBe(false);
    expect(containsExactMatch('100 MiB')).toBe(false);
    expect(containsExactMatch('100 min')).toBe(false);
    expect(containsExactMatch('100 d')).toBe(false);

    // Check possible cases for bytes
    expect(containsExactMatch('100 B')).toBe(true);
    expect(containsExactMatch('100 kiB')).toBe(false);
    expect(containsExactMatch('100 MiB')).toBe(false);
    expect(containsExactMatch('100 GiB')).toBe(false);
    expect(containsExactMatch('100 TiB')).toBe(false);
    expect(containsExactMatch('100 PiB')).toBe(false);
    expect(containsExactMatch('100 EiB')).toBe(false);
    expect(containsExactMatch('100 ZiB')).toBe(false);
    expect(containsExactMatch('100 YiB')).toBe(false);

    // Check possible cases for time based formatters
    expect(containsExactMatch('100 ms')).toBe(true);
    expect(containsExactMatch('100 ns')).toBe(false);
    expect(containsExactMatch('100 µs')).toBe(false);
    expect(containsExactMatch('100 s')).toBe(false);
    expect(containsExactMatch('100 min')).toBe(false);
    expect(containsExactMatch('100 h')).toBe(false);
    expect(containsExactMatch('100 d')).toBe(false);

    // Check possible cases for siPrefix
    expect(containsExactMatch('100')).toBe(true);
    expect(containsExactMatch('100.000')).toBe(true);
    expect(containsExactMatch('100 k')).toBe(false);
    expect(containsExactMatch('100 M')).toBe(false);
    expect(containsExactMatch('100 G')).toBe(false);
    expect(containsExactMatch('100 T')).toBe(false);
    expect(containsExactMatch('100 P')).toBe(false);
    expect(containsExactMatch('100 E')).toBe(false);
    expect(containsExactMatch('100 Z')).toBe(false);
    expect(containsExactMatch('100 Y')).toBe(false);
  });

  it('check input not valid', () => {
    expect(containsExactMatch('')).toBe(false);
    expect(containsExactMatch('ABC1D')).toBe(false);
    expect(containsExactMatch('ABC 1D')).toBe(false);
    expect(containsExactMatch('ABC B')).toBe(false);
  });

  it('check input when having empty spaces', () => {
    expect(containsExactMatch('  400 B  ')).toBe(true);
    expect(containsExactMatch('  100 ms  ')).toBe(true);
    expect(containsExactMatch('  ABC  ')).toBe(false);
    expect(containsExactMatch('  ABC')).toBe(false);
    expect(containsExactMatch('ABC  ')).toBe(false);
    expect(containsExactMatch('ABC B ')).toBe(false);
    expect(containsExactMatch('ABC ms ')).toBe(false);
  });

  it('check input with multiple spaces between number and unit', () => {
    expect(containsExactMatch('100     B')).toBe(true);
    expect(containsExactMatch('100     ms')).toBe(true);
  });
});

describe('shouldDisplayConvertedUnits', () => {
  it('check with number formatters', () => {
    // Number, e.g. 42
    expect(shouldDisplayConvertedUnits(false, '1.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '100.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10,000.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000,000.00')).toBe(false);

    // Number, e.g. 42.15
    expect(shouldDisplayConvertedUnits(false, '1')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '100')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10,000')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000,000')).toBe(false);
  });

  it('check with percentage formatters', () => {
    // Percentage, e.g. 42%
    expect(shouldDisplayConvertedUnits(false, '1%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '100%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10,000%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000,000%')).toBe(false);

    // Percentage, e.g. 42.15%
    expect(shouldDisplayConvertedUnits(false, '100.00%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000.00%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10,000.00%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '100,000.00%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '1,000,000.00%')).toBe(false);
    expect(shouldDisplayConvertedUnits(false, '10,000,000.00%')).toBe(false);
  });

  it('check with bytes formatters', () => {
    // Bytes, e.g. 3 MiB
    expect(shouldDisplayConvertedUnits(true, '1 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '100 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '1,000 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1000 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1000 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1000 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10 YiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 YiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100 YiB')).toBe(true);

    // Bytes, e.g. 3.00 MiB
    expect(shouldDisplayConvertedUnits(true, '1.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '100.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '1,000.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10.00 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1000.00 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1000.00 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1000.00 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00 YiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 YiB')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00 YiB')).toBe(true);
  });

  it('check with milliseconds and latency formatters', () => {
    // Milliseconds, e.g. 42ms and Latency, e.g. &lt; 1ms
    expect(shouldDisplayConvertedUnits(true, '1ms')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10ms')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '100ms')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '1s')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10s')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '2min')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '20min')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1d')).toBe(true);

    // Milliseconds, e.g. 42.15ms
    expect(shouldDisplayConvertedUnits(true, '1.00ms')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10.00ms')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '100.00ms')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '1.00s')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00s')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '2.00min')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '20.00min')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00d')).toBe(true);
  });

  it('check with siPrefix formatters', () => {
    // SI Prefix, e.g. 3M
    expect(shouldDisplayConvertedUnits(true, '1')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '100')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '1k')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10k')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100k')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1M')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10M')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100M')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1G')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10G')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100G')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1T')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10T')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100T')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1P')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10P')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100P')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1E')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10E')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100E')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1Z')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10Z')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100Z')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1Y')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10Y')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100Y')).toBe(true);

    // SI Prefix, e.g. 3.146M
    expect(shouldDisplayConvertedUnits(true, '1.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '10.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '100.00')).toBe(false);
    expect(shouldDisplayConvertedUnits(true, '1.00k')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00k')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00k')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00M')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00M')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00M')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00G')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00G')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00G')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00T')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00T')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00T')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00P')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00P')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00P')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00E')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00E')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00E')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00Z')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00Z')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00Z')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '1.00Y')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '10.00Y')).toBe(true);
    expect(shouldDisplayConvertedUnits(true, '100.00Y')).toBe(true);
  });
});
