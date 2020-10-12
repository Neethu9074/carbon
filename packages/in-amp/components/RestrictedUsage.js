import React from 'react';

import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import UsageCharts from 'in-amp/components/UsageCharts';
import useUrlState from 'in-hooks/useUrlState';
import config from 'in-services/config';
import { days } from 'in-services/time';
import Title from 'in-components/Title';

import locals from './Usage.mless';

export default function RestrictedUsage() {
  const [{ windowSize }, onChange] = useUrlState({
    bind: [
      {
        path: '/usage',
        name: 'windowSize',
        serializer: buildJsonSerializer(),
        parser: buildJsonParser(),
        initialState: days.toMillis(30)
      }
    ]
  });
  const setWindowSize = _windowSize => onChange({ windowSize: _windowSize });
  const tenantUnit = {
    tenant: config.tenant,
    unit: config.tenantUnit
  };

  return (
    <>
      <Title title="Account Usage" />

      <div className={locals.buttonHeader}>
        {/* Empty div to have the AmpTimeSelection right aligned without a custom style */}
        <div />

        <AmpTimeSelection windowSize={windowSize} setWindowSize={setWindowSize} />
      </div>

      <UsageCharts windowSize={windowSize} tenantUnit={tenantUnit} />
    </>
  );
}
