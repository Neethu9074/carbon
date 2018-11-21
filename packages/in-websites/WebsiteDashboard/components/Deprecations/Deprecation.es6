import React from 'react';

import Pill from 'in-new-components/Pill';
import Card from 'in-new-components/Card';

export default function Deprecation({ title, children, supportedUntil }) {
  return (
    <Card title={title} header={<Pill color="#fa0">Supported until {supportedUntil}</Pill>}>
      {children}
    </Card>
  );
}
