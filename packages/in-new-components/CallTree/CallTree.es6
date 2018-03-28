import React from 'react';

import TreeHeader from 'in-new-components/CallTree/components/TreeHeader';
import Row from 'in-new-components/CallTree/components/Row';
import createScale from 'in-charts/scale';

import locals from './CallTree.mless';

export default function CallTree({ rootSpan, getColor = () => '#e6e6e6' }) {
  const scale = createScale();
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(rootSpan.start);
  scale.setDomainTo(rootSpan.start + rootSpan.duration);

  return (
    <div className={locals.callTree}>
      <TreeHeader rootSpan={rootSpan} scale={scale} />
      <Row span={rootSpan} getColor={getColor} scale={scale} />
    </div>
  );
}
