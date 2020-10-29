import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { tenantUnitChanged } from 'in-amp/tracker';
import useUrlState from 'in-hooks/useUrlState';
import { days } from 'in-services/time';

export default function useAmpUrlInformation(path, initialTUState) {
  const [{ tenantUnit, windowSize }, onChange] = useUrlState({
    bind: [
      {
        path,
        name: 'tenantUnit',
        serializer: buildJsonSerializer(),
        parser: buildJsonParser(),
        initialState: initialTUState
      },
      {
        path,
        name: 'windowSize',
        serializer: buildJsonSerializer(),
        parser: buildJsonParser(),
        initialState: days.toMillis(30)
      }
    ]
  });
  const setTenantUnit = _tenantUnit => {
    tenantUnitChanged(_tenantUnit);
    onChange({ tenantUnit: _tenantUnit });
  };
  const setWindowSize = _windowSize => onChange({ windowSize: _windowSize });

  return { windowSize, setWindowSize, tenantUnit, setTenantUnit };
}
