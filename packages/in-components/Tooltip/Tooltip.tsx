/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useRef, Children, cloneElement, useCallback, ReactNode, ReactElement } from 'react';
import invariant from 'invariant';
import rpt from 'prop-types';
import React from 'react';

import { Tooltip as CarbonTooltip } from '@instana/components';
import { createLogger } from '@instana/logger';

import { Align, ThemeStyle, setActiveTooltip, clearActiveTooltip } from 'in-components/Tooltip/store';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { carbonTooltipEnabled } from 'in-services/featureFlags';

const logger = createLogger('in-components/Tooltip');

export interface Props {
  align?: Align;
  themeStyle?: ThemeStyle;
  delay?: number;
  children: ReactElement;
  content: ReactNode;
  legacy?: boolean; // Used to toggle legacy component vs Carbon tooltip
  overwriteBlock?: boolean; // Used to pass to new Carbon component
  caret?: boolean; // Used to pass to new Carbon component
  overflowEllipsis?: boolean; // Used to pass to new Carbon component
  forceTheme?: boolean; // Used to control which theme is used for Carbon
}

interface TooltipState {
  isActive: boolean;
  timeoutHandle?: any;
  domNode?: HTMLElement;
  content: ReactNode;
}

const CarbonTooltipWithObserver = ({
  align,
  forceTheme,
  themeStyle,
  delay,
  content,
  caret,
  overwriteBlock,
  overflowEllipsis,
  children
}: Props) => {
  /* Intentionally, the width and height are not used. */
  const { ref: toolTipWrapperRef } = useResizeObserverCustom<HTMLDivElement>();
  // For carbon convert mousePosition -> auto
  const updatedAlign = (align == 'mousePosition' && 'auto') || align;
  const themeToPass = (forceTheme && themeStyle) || 'dark';

  return (
    <CarbonTooltip
      ref={toolTipWrapperRef}
      align={updatedAlign}
      delay={delay}
      content={content}
      caret={caret}
      overwriteBlock={overwriteBlock}
      themeStyle={themeToPass}
      overflowEllipsis={overflowEllipsis}
    >
      {children}
    </CarbonTooltip>
  );
};

/**
 * Tooltip using Carbon Tooltip, when not enabling the legacy property.
 * (which was only needed on 10 locations)
 *
 * Technically, the underlying CarbonTooltip is a critical implementation,
 * and was only meant to make the migration to carbon easier.
 *
 * Main issue is the translation of the "auto" alignment into the autoAlign
 * feature in Carbon/PopOver under the hood, which is only an experimental
 * feature.
 *
 * In rare cases (but reproducible), it leads to this error:
 *
 * "ResizeObserver loop completed with undelivered notifications."
 */
export default function Tooltip({
  align = 'auto',
  delay = 0,
  themeStyle,
  children,
  content,
  legacy = false, // Used to toggle legacy component vs Carbon tooltip
  overwriteBlock = false, // Used to pass to new Carbon component
  caret = undefined, // Used to pass to new Carbon component
  overflowEllipsis = false, // Used to pass to new Carbon component
  forceTheme = false
}: Props) {
  // Use the Carbon tooltip if the feature flag is set and NOT Legacy being used
  // Content is sometimes undefined and if its undefined we have nothing to show then
  // skip the carbon tooltip and let the legacy handle the undefined scenario
  if (carbonTooltipEnabled && !legacy && content) {
    return (
      <CarbonTooltipWithObserver
        align={align}
        forceTheme={forceTheme}
        themeStyle={themeStyle}
        delay={delay}
        content={content}
        caret={caret}
        overwriteBlock={overwriteBlock}
        overflowEllipsis={overflowEllipsis}
      >
        {children}
      </CarbonTooltipWithObserver>
    );
  }

  if (__DEV__) {
    invariant(
      // @ts-expect-error We need to keep this "always-false"-check because of existing
      // JavaScript code that cannot be statically enforced.
      Children.count(children) === 1 && children.type !== Symbol.for('react.fragment'),
      `Only one child which is not of type React.Fragment is allowed.`
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tooltipState = useRef<TooltipState>({
    isActive: false,
    content: content
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = useCallback(
    domNode => {
      const { isActive, timeoutHandle, domNode: previousDomNode } = tooltipState.current || {};

      // Dispose old state if any
      if (previousDomNode && previousDomNode.removeEventListener) {
        previousDomNode.removeEventListener('mouseleave', onMouseOut, false);
        previousDomNode.removeEventListener('mouseenter', onMouseIn, false);
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      if (isActive) {
        clearActiveTooltip();
      }

      // reset state
      tooltipState.current = {
        isActive: false,
        domNode,
        content: content
      };
      // set up new listeners
      if (domNode && domNode.addEventListener) {
        try {
          domNode.addEventListener('mouseenter', onMouseIn, false);
          domNode.addEventListener('mouseleave', onMouseOut, false);
        } catch (e) {
          // We are currently seeing errors being thrown at this location. Trying to drill down on the reason for this error…
          logger.debug(
            `Failed to add listeners for tooltip. Message: '${(e as Error).message}'. Tooltip content: ${String(
              content
            )}`,
            e
          );
        }
      }

      function onMouseIn(e: MouseEvent) {
        if (delay > 0) {
          tooltipState.current.timeoutHandle = setTimeout(showTooltip, delay, e);
        } else {
          showTooltip(e);
        }
      }

      function onMouseOut() {
        if (tooltipState.current.timeoutHandle) {
          clearTimeout(tooltipState.current.timeoutHandle);
          tooltipState.current.timeoutHandle = null;
        }
        clearActiveTooltip();
        tooltipState.current.isActive = false;
      }

      function showTooltip(mouseEvent: MouseEvent) {
        tooltipState.current.isActive = true;
        setActiveTooltip({
          focusedElement: domNode,
          content: tooltipState.current.content,
          themeStyle,
          align,
          mouseEvent
        });
      }
    },
    [align, delay, themeStyle, content]
  );

  return cloneElement(Children.only(children), { ref });
}

Tooltip.propTypes = {
  content: rpt.node,
  themeStyle: rpt.string,
  children: rpt.node.isRequired,
  align: rpt.oneOf([
    'leftBottom',
    'leftMiddle',
    'leftTop',
    'topLeft',
    'topMiddle',
    'topRight',
    'rightTop',
    'rightMiddle',
    'rightBottom',
    'bottomLeft',
    'bottomMiddle',
    'bottomRight',
    'auto',
    'mousePosition'
  ]),
  delay: rpt.number
};
