/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shouldDisplayConvertedUnits } from 'in-custom-dashboards/widgets/_shared/Threshold/thresholdUnitUtils';

describe('shouldDisplayConvertedUnits', () => {
  it('check input contains only numbers', () => {
    expect(shouldDisplayConvertedUnits('123')).toBe(false);
    expect(shouldDisplayConvertedUnits('123.000')).toBe(false);
    expect(shouldDisplayConvertedUnits('1,023.000')).toBe(false);
    expect(shouldDisplayConvertedUnits('0')).toBe(false);
  });

  it('check with bytes formatters', () => {
    // Bytes, e.g. 3 MiB
    expect(shouldDisplayConvertedUnits('1 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('10 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('100 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('1,000 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('100.000 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('10 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('1000 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('1000 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('1000 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10 YiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 YiB')).toBe(true);

    // Bytes, e.g. 3.00 MiB
    expect(shouldDisplayConvertedUnits('1.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('10.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('100.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('1,000.00 B')).toBe(false);
    expect(shouldDisplayConvertedUnits('10.00 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('1000.00 kiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('1000.00 MiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('1000.00 GiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 TiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 PiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 EiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 ZiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00 YiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 YiB')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00 YiB')).toBe(true);
  });

  it('check with milliseconds and latency formatters', () => {
    // Milliseconds, e.g. 42ms and Latency, e.g. &lt; 1ms

    expect(shouldDisplayConvertedUnits('100 ns')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 µs')).toBe(true);
    expect(shouldDisplayConvertedUnits('1ms')).toBe(false);
    expect(shouldDisplayConvertedUnits('10ms')).toBe(false);
    expect(shouldDisplayConvertedUnits('100 ms')).toBe(false);
    expect(shouldDisplayConvertedUnits('100ms')).toBe(false);
    expect(shouldDisplayConvertedUnits('1s')).toBe(true);
    expect(shouldDisplayConvertedUnits('10s')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 s')).toBe(true);
    expect(shouldDisplayConvertedUnits('2min')).toBe(true);
    expect(shouldDisplayConvertedUnits('20min')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 min')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 h')).toBe(true);
    expect(shouldDisplayConvertedUnits('1d')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 d')).toBe(true);

    // Milliseconds, e.g. 42.15ms
    expect(shouldDisplayConvertedUnits('1.00ms')).toBe(false);
    expect(shouldDisplayConvertedUnits('10.00ms')).toBe(false);
    expect(shouldDisplayConvertedUnits('100.00ms')).toBe(false);
    expect(shouldDisplayConvertedUnits('1.00s')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00s')).toBe(true);
    expect(shouldDisplayConvertedUnits('2.00min')).toBe(true);
    expect(shouldDisplayConvertedUnits('20.00min')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00d')).toBe(true);
  });

  it('check with siPrefix formatters', () => {
    // SI Prefix, e.g. 3M
    expect(shouldDisplayConvertedUnits('1')).toBe(false);
    expect(shouldDisplayConvertedUnits('10')).toBe(false);
    expect(shouldDisplayConvertedUnits('100')).toBe(false);
    expect(shouldDisplayConvertedUnits('1k')).toBe(true);
    expect(shouldDisplayConvertedUnits('10k')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 k')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.000')).toBe(false);
    expect(shouldDisplayConvertedUnits('100k')).toBe(true);
    expect(shouldDisplayConvertedUnits('1M')).toBe(true);
    expect(shouldDisplayConvertedUnits('10M')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 M')).toBe(true);
    expect(shouldDisplayConvertedUnits('100M')).toBe(true);
    expect(shouldDisplayConvertedUnits('1G')).toBe(true);
    expect(shouldDisplayConvertedUnits('10G')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 G')).toBe(true);
    expect(shouldDisplayConvertedUnits('100G')).toBe(true);
    expect(shouldDisplayConvertedUnits('1T')).toBe(true);
    expect(shouldDisplayConvertedUnits('10T')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 T')).toBe(true);
    expect(shouldDisplayConvertedUnits('100T')).toBe(true);
    expect(shouldDisplayConvertedUnits('1P')).toBe(true);
    expect(shouldDisplayConvertedUnits('10P')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 P')).toBe(true);
    expect(shouldDisplayConvertedUnits('100P')).toBe(true);
    expect(shouldDisplayConvertedUnits('1E')).toBe(true);
    expect(shouldDisplayConvertedUnits('10E')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 E')).toBe(true);
    expect(shouldDisplayConvertedUnits('100E')).toBe(true);
    expect(shouldDisplayConvertedUnits('1Z')).toBe(true);
    expect(shouldDisplayConvertedUnits('10Z')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 Z')).toBe(true);
    expect(shouldDisplayConvertedUnits('100Z')).toBe(true);
    expect(shouldDisplayConvertedUnits('1Y')).toBe(true);
    expect(shouldDisplayConvertedUnits('10Y')).toBe(true);
    expect(shouldDisplayConvertedUnits('100 Y')).toBe(true);
    expect(shouldDisplayConvertedUnits('100Y')).toBe(true);

    // SI Prefix, e.g. 3.146M
    expect(shouldDisplayConvertedUnits('1.00')).toBe(false);
    expect(shouldDisplayConvertedUnits('10.00')).toBe(false);
    expect(shouldDisplayConvertedUnits('100.00')).toBe(false);
    expect(shouldDisplayConvertedUnits('1.00k')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00k')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00k')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00M')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00M')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00M')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00G')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00G')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00G')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00T')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00T')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00T')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00P')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00P')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00P')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00E')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00E')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00E')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00Z')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00Z')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00Z')).toBe(true);
    expect(shouldDisplayConvertedUnits('1.00Y')).toBe(true);
    expect(shouldDisplayConvertedUnits('10.00Y')).toBe(true);
    expect(shouldDisplayConvertedUnits('100.00Y')).toBe(true);
  });
});
