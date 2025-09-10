/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import usageTimePresets from 'in-amp/components/usageTimePresets';
import fupTimePresets from 'in-amp/components/fupTimePreset';
import { tenantUnitChanged } from 'in-amp/tracker';
import useUrlState from 'in-hooks/useUrlState';

const thisMonthTimePreset = usageTimePresets.filter(timePreset => timePreset.timeRange === 'this_month')[0];
const thisMonthTimePresetFup = fupTimePresets.filter(timePreset => timePreset.fupTimeRange === 'this_month')[0];

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
      name: 'fupTimeRange',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      initialState: thisMonthTimePresetFup.fupTimeRange
    },
    {
      path: '/amp',
      name: 'fupWindowSize',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      initialState: thisMonthTimePresetFup.fupWindowSize
    },
    {
      path: '/amp',
      name: 'fupTo',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      initialState: thisMonthTimePresetFup.fupTo
    },
    {
      path: '/amp',
      name: 'to',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      initialState: thisMonthTimePreset.to
    },
    {
      path: '/amp',
      name: 'presentation',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(),
      // On premise we don't support cumulative, so set the initialState to distinct
      initialState: onPremLicenseInformationEnabled ? 'distinct' : 'cumulative'
    }
  ]
};

export default function useAmpUrlInformation(initialTUState) {
  const [
    { tenantUnit = initialTUState, windowSize, fupWindowSize, timeRange, fupTimeRange, fupTo, to, presentation },
    onChange
  ] = useUrlState(urlSettingsConfig);
  const setTenantUnit = _tenantUnit => {
    tenantUnitChanged(_tenantUnit);
    onChange({ tenantUnit: _tenantUnit });
  };
  const setWindowSize = _windowSize => onChange({ windowSize: _windowSize });
  const setTimeRange = _timeRange => onChange({ timeRange: _timeRange });
  const setFupTimeRange = _fupTimeRange => onChange({ fupTimeRange: _fupTimeRange });
  const setFupWindowSize = _fupWindowSize => onChange({ fupWindowSize: _fupWindowSize });
  const fupSetTo = _fupTo => onChange({ fupTo: _fupTo });
  const setTo = _to => onChange({ to: _to });
  const setPresentation = _presentation => onChange({ presentation: _presentation });

  return {
    windowSize,
    setWindowSize,
    tenantUnit,
    setTenantUnit,
    timeRange,
    setTimeRange,
    fupTimeRange,
    setFupTimeRange,
    fupWindowSize,
    setFupWindowSize,
    fupTo,
    fupSetTo,
    to,
    setTo,
    presentation,
    setPresentation
  };
}
