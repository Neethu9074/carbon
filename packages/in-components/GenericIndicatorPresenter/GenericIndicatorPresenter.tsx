/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import React, { ReactElement } from 'react';

import { Popover, PopoverContent } from '@instana/carbon';
import { AutoReposition } from '@instana/components';

import usePopoverClickHandler from 'in-hooks/usePopoverClickHandler';

interface ConditionalWrapProps {
  children: React.ReactNode;
  inContentArea?: boolean;
}
const ConditionalWrap = ({ children, inContentArea }: ConditionalWrapProps): React.ReactElement =>
  inContentArea ? <>{children}</> : <AutoReposition>{children}</AutoReposition>;

export interface GenericIndicatorPresenterProps {
  /**
   * The Content component to be displayed in the popover
   */
  Content: React.JSXElementConstructor<any>;

  /**
   * Props to pass to the Content component
   */
  contentProps: any & { close?: () => void };

  /**
   * The Indicator component that triggers the popover
   */
  IndicatorPresenter: React.JSXElementConstructor<any>;

  /**
   * Props to pass to the IndicatorPresenter component
   */
  indicatorProps: any & { onClick?: () => void };

  /**
   * Detemines location and styling of popover
   */
  inContentArea: boolean;
}

export default function GenericIndicatorPresenter({
  contentProps,
  indicatorProps,
  IndicatorPresenter,
  Content,
  inContentArea
}: GenericIndicatorPresenterProps): ReactElement {
  const { open, toggle, ref } = usePopoverClickHandler();

  return (
    <ConditionalWrap inContentArea={inContentArea}>
      <Popover
        ref={ref}
        open={open}
        isTabTip={!inContentArea}
        caret={false}
        autoAlign={inContentArea}
        dropShadow
        align={inContentArea ? 'left-start' : 'bottom-start'}
      >
        <div>
          <IndicatorPresenter {...indicatorProps} onClick={toggle} isOpen={open} />
        </div>
        {open && (
          <PopoverContent>
            <Content {...contentProps} inContentArea={inContentArea} close={toggle} />
          </PopoverContent>
        )}
      </Popover>
    </ConditionalWrap>
  );
}
