import React from 'react';

import { ErrorRows, HorizontalIndicatorRow, LoadingSkeletonRows } from 'in-components/tables/sharedComponents';
import Group from 'in-profiling/analyze/AnalyzeView/GroupedProfiledProcesses/Group';

export default function Groups({ items, errors, progress, getGroupAsFilterUrl, columnCount }) {
  return (
    <>
      {items.map(item => (
        <Group key={item.processGroup.groupName} item={item.processGroup} getGroupAsFilterUrl={getGroupAsFilterUrl} />
      ))}

      <HorizontalIndicatorRow cols={columnCount} progress={progress} />
      <ErrorRows cols={columnCount} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={columnCount} />}
    </>
  );
}
