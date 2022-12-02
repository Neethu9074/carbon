/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { KeyValue, Li, SvgIcon } from '@instana/components';

import locals from './AreaExpandableList.mless';

interface AreaExpandableListProps {
  children: React.ReactChildren;
  firstColumnLabel?: string;
  firstColumnHeadline: string;
  iconType: string;
  secondColumnHeadline?: string;
  secondColumnLabel?: string;
}

export const AreaExpandableList = ({
  children,
  firstColumnLabel,
  firstColumnHeadline,
  iconType,
  secondColumnHeadline,
  secondColumnLabel
}: AreaExpandableListProps) => {
  const shouldRenderSecondColumn = secondColumnLabel || secondColumnHeadline;

  return (
    <Li toggleContentOnRowClick renderNestedContent={() => children}>
      <div className={locals.container}>
        <div className={locals.iconContainer}>
          <SvgIcon className={locals.icon} type={iconType} />
        </div>
        <div className={locals.columnsContainer}>
          <KeyValue label={firstColumnLabel} customValue={firstColumnHeadline} />
          {shouldRenderSecondColumn && (
            <div className={locals.secondColumnContainer}>
              <KeyValue label={secondColumnLabel} customValue={secondColumnHeadline} />
            </div>
          )}
        </div>
      </div>
    </Li>
  );
};
