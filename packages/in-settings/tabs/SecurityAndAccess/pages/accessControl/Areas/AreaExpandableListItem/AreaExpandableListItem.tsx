/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { KeyValue, Li, SvgIcon, LiProps, LoadingSkeleton } from '@instana/components';

import locals from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem/AreaExpandableListItem.mless';

interface AreaExpandableListItemProps extends Omit<LiProps, 'children'> {
  children?: React.ReactNode;
  disabled?: boolean;
  firstColumnLabel?: string;
  firstColumnHeadline: string;
  iconType: string;
  loading?: boolean;
  secondColumnHeadline?: string;
  secondColumnLabel?: string;
}

export const AreaExpandableListItem = ({
  children,
  disabled,
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
    <Li
      noAlternatingBg
      toggleContentOnRowClick={!disabled}
      subList={!disabled ? subList : null}
      className={classNames({ [locals.listItemDisabled]: disabled })}
      {...optionalProps}
    >
      <div className={locals.container}>
        <div className={classNames({ [locals.iconContainer]: true, [locals.iconDisabled]: disabled })}>
          <SvgIcon type={iconType} />
        </div>
        <div className={locals.columnsContainer}>
          <KeyValue
            className={classNames({ [locals.columnDisabled]: disabled })}
            label={firstColumnLabel}
            customValue={firstColumnHeadline}
          />
          {shouldRenderSecondColumn && (
            <div className={locals.secondColumnContainer}>
              <KeyValue
                className={classNames({ [locals.columnDisabled]: disabled })}
                label={secondColumnLabel}
                customValue={secondColumnHeadline}
              />
            </div>
          )}
        </div>
      </div>
    </Li>
  );
};
