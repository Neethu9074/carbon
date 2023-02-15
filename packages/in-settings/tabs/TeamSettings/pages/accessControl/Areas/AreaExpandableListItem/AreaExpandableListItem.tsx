/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { KeyValue, Li, SvgIcon, LiProps, LoadingSkeleton } from '@instana/components';

import locals from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem/AreaExpandableListItem.mless';

interface AreaExpandableListItemProps extends Omit<LiProps, 'children'> {
  children?: React.ReactNode;
  firstColumnLabel?: string;
  firstColumnHeadline: string;
  iconType: string;
  loading?: boolean;
  secondColumnHeadline?: string;
  secondColumnLabel?: string;
}

export const AreaExpandableListItem = ({
  children,
  firstColumnLabel,
  firstColumnHeadline,
  iconType,
  loading = false,
  secondColumnHeadline,
  secondColumnLabel,
  subList
}: AreaExpandableListItemProps) => {
  const shouldRenderSecondColumn = secondColumnLabel || secondColumnHeadline;

  if (loading)
    return (
      <Li>
        <LoadingSkeleton className={locals.skeleton} />
      </Li>
    );

  // By default passing even undefined children to the renderNestedContent
  // prop will make it render an empty div with padding, so we have to
  // only pass it when children are actually there
  const optionalProps = {
    ...(children && { renderNestedContent: () => children })
  };

  return (
    <Li noAlternatingBg toggleContentOnRowClick subList={subList} {...optionalProps}>
      <div className={locals.container}>
        <div className={locals.iconContainer}>
          <SvgIcon type={iconType} />
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
