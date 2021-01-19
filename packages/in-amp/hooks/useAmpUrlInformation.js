/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { tenantUnitChanged } from 'in-amp/tracker';
import useUrlState from 'in-hooks/useUrlState';
import { days } from 'in-services/time';

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
      initialState: days.toMillis(30)
    }
  ]
};

export default function useAmpUrlInformation(initialTUState) {
  const [{ tenantUnit = initialTUState, windowSize }, onChange] = useUrlState(urlSettingsConfig);
  const setTenantUnit = _tenantUnit => {
    tenantUnitChanged(_tenantUnit);
    onChange({ tenantUnit: _tenantUnit });
  };
  const setWindowSize = _windowSize => onChange({ windowSize: _windowSize });

  return { windowSize, setWindowSize, tenantUnit, setTenantUnit };
}
