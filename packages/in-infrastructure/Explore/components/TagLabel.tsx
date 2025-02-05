/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { Result } from '@instana/types';

import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from './TagLabel.mless';

export default function TagLabel({ label: path }: { label: Result<string[] | undefined> }) {
  if (isLoading(path)) {
    return (
      <div className={locals.content}>
        <LoadingSkeleton className={locals.skeleton} />
      </div>
    );
  }
  const labelSpan = (path.data && <Label path={path.data} />) || <></>;

  const label = path.data && path.data[path.data.length - 1];
  // take a guess that the content will be truncated, although this is a bit hacky because
  // the truncation happens in CSS
  const labelWithTooltip =
    label && label.length > 20 ? (
      <Tooltip content={label} align="bottomMiddle">
        {labelSpan}
      </Tooltip>
    ) : (
      labelSpan
    );

  return <div className={locals.content}>{labelWithTooltip}</div>;
}

function Label({ path }: { path: string[] }) {
  const tagLabel = path[path.length - 1];
  const categoryLabel = path
    .slice(0, -1)
    .filter(l => l !== 'Others')
    .join(' / ');
  return (
    <>
      <Line level={categoryLabel} />
      <Line level={tagLabel} />
    </>
  );
}

function Line({ level }: { level: string }) {
  return (
    <span className={locals.label}>
      <bdi>{level}</bdi>
    </span>
  );
}
