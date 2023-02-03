/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { KeyValue, Li, SvgIcon, LiProps } from '@instana/components';

import locals from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem/AreaExpandableListItem.mless';

interface AreaExpandableListItemProps extends LiProps {
  firstColumnLabel?: string;
  firstColumnHeadline: string;
  iconType: string;
  secondColumnHeadline?: string;
  secondColumnLabel?: string;
}

export const AreaExpandableListItem = ({
  children,
  firstColumnLabel,
  firstColumnHeadline,
  iconType,
  secondColumnHeadline,
  secondColumnLabel,
  subList
}: AreaExpandableListItemProps) => {
  const shouldRenderSecondColumn = secondColumnLabel || secondColumnHeadline;

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
