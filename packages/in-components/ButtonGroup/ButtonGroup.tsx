/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ComponentProps } from 'react';
import classNames from 'classnames';

import { Button } from '@instana/components';

import locals from './ButtonGroup.mless';

type ButtonProps = ComponentProps<typeof Button>;
type ButtonGroupProps<T> = {
  buttonPropsList: ({
    text: ButtonProps['children'];
  } & Omit<ButtonProps, 'children'>)[];
  activeKey: ButtonProps['key'];
  segmented?: boolean | undefined;
  className?: string | undefined;
  disabledWidgetInLive?: boolean;
} & T;

/**
 * This is the old non-carbonized component.
 *
 * @deprecated Do not use it any longer, but use it from @instana/components:
 *
 *   import { ButtonGroup } from '@instana/components'
 */
export default function ButtonGroup<RemainingPropsType = {}>({
  buttonPropsList,
  activeKey,
  segmented,
  className,
  disabledWidgetInLive,
  ...remainingProps
}: ButtonGroupProps<RemainingPropsType>) {
  return (
    <div
      className={classNames(className, {
        [locals.buttonGroup]: true
      })}
    >
      {buttonPropsList.map((buttonProps, i) => (
        <Button
          key={buttonProps.key}
          {...buttonProps}
          {...remainingProps}
          className={classNames(buttonProps.className, locals.button, {
            [locals.disabledWidget]: disabledWidgetInLive && activeKey !== buttonProps.key,
            [locals.segmented]: segmented,
            [locals.first]: i === 0,
            [locals.last]: i === buttonPropsList.length - 1,
            [locals.active]: activeKey === buttonProps.key
          })}
        >
          {buttonProps.text}
        </Button>
      ))}
    </div>
  );
}
