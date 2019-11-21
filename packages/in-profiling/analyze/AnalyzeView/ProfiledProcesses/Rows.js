import React from 'react';

import { HorizontalIndicatorRow, LoadingSkeletonRows, ErrorRows } from 'in-components/tables/sharedComponents';
import Row from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/Row';

export default function ProfiledProcessesTable(props) {
  const { items, errors, progress, cols } = props;

  return (
    <>
      {items.map((item, i) => (
        <Row key={i} item={item.profiledProcess} cols={cols} />
      ))}

      <HorizontalIndicatorRow cols={cols} progress={progress} />
      <ErrorRows cols={cols} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={cols} />}
    </>
  );
}
