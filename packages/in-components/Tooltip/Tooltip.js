/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useRef, Children, cloneElement, useCallback } from 'react';
import { createLogger } from '@instana/logger';
import invariant from 'invariant';
import rpt from 'prop-types';

import { setActiveTooltip, clearActiveTooltip } from 'in-components/Tooltip/store';

const logger = createLogger('in-components/Tooltip');

export default function Tooltip({ align = 'auto', delay = 0, themeStyle, children, content }) {
  if (__DEV__) {
    invariant(
      Children.count(children) === 1 && children.type !== Symbol.for('react.fragment'),
      `Only one child which is not of type React.Fragment is allowed.`
    );
  }

  const tooltipState = useRef();
  const ref = useCallback(
    domNode => {
      const { isActive, timeoutHandle, domNode: previousDomNode } = tooltipState.current || {};

      // Dispose old state if any
      if (previousDomNode) {
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
        domNode
      };

      // set up new listeners
      if (domNode) {
        try {
          domNode.addEventListener('mouseenter', onMouseIn, false);
          domNode.addEventListener('mouseleave', onMouseOut, false);
        } catch (e) {
          // We are currently seeing errors being thrown at this location. Trying to drill down on the reason for this error…
          logger.debug(
            `Failed to add listeners for tooltip. Message: '${e.message}'. Tooltip content: ${String(content)}`,
            e
          );
        }
      }

      function onMouseIn(e) {
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

      function showTooltip(mouseEvent) {
        tooltipState.current.isActive = true;
        setActiveTooltip({
          focusedElement: domNode,
          content,
          themeStyle,
          align,
          mouseEvent
        });
      }
    },
    [align, delay, themeStyle, content]
  );

  return Children.map(children, child => cloneElement(child, { ref }));
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
