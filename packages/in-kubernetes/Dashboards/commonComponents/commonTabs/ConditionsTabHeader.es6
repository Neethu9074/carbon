import React from 'react';

import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';

export default function getCounterComponent({ getCounter }) {
  return <TabLabelWithCounter label="Conditions" getCounters={getCounter} resultPropName="length" />;
}
