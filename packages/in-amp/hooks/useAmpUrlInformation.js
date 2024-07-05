/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import usageTimePresets from 'in-amp/components/usageTimePresets';
import { tenantUnitChanged } from 'in-amp/tracker';
import useUrlState from 'in-hooks/useUrlState';

const thisMonthTimePreset = usageTimePresets.filter(timePreset => timePreset.timeRange === 'this_month')[0];

const urlSettingsConfig = {
  bind: [
    {
      path: '/amp',
      name: 'tenantUnit',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser()
    },
    {
      path: '/amp',
      name: 'windowSize',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      initialState: thisMonthTimePreset.windowSize
    },
    {
      path: '/amp',
      name: 'timeRange',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      initialState: thisMonthTimePreset.timeRange
    },
    {
      path: '/amp',
      name: 'to',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      initialState: thisMonthTimePreset.to
    }
  ]
};

export default function useAmpUrlInformation(initialTUState) {
  const [{ tenantUnit = initialTUState, windowSize, timeRange, to }, onChange] = useUrlState(urlSettingsConfig);
  const setTenantUnit = _tenantUnit => {
    tenantUnitChanged(_tenantUnit);
    onChange({ tenantUnit: _tenantUnit });
  };
  const setWindowSize = _windowSize => onChange({ windowSize: _windowSize });
  const setTimeRange = _timeRange => onChange({ timeRange: _timeRange });
  const setTo = _to => onChange({ to: _to });

  return { windowSize, setWindowSize, tenantUnit, setTenantUnit, timeRange, setTimeRange, to, setTo };
}
