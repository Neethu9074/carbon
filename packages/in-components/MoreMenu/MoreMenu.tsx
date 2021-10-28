/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Button, ButtonKinds, ButtonSizes, getEnumValues } from '@instana/components';

import { stopPropagation } from 'in-services/util/function';
import Overlay from 'in-components/overlays/Overlay';

import locals from './MoreMenu.mless';

export default function MoreMenu({
  children,
  kind = 'secondary',
  size = 'normal',
  className,
  renderInteractiveElement
}) {
  return (
    <Overlay
      withoutWrapper
      content={MoreMenuContent}
      props={{
        content: children
      }}
    >
      {({ toggle, ref }) =>
        renderInteractiveElement?.({
          toggle,
          ref
        }) ?? (
          <Button
            className={classNames(locals.button, className)}
            onClick={e => {
              stopPropagation(e);
              toggle();
            }}
            ref={ref}
            icon="lib_menu_more_horizontal"
            size={size}
            kind={kind}
          />
        )
      }
    </Overlay>
  );
}

MoreMenu.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  kind: PropTypes.oneOf(getEnumValues(ButtonKinds)),
  size: PropTypes.oneOf(getEnumValues(ButtonSizes)),
  /**
   * Renders a custom element to open the menu.
   * Use this if you need some kind of different button etc.
   */
  renderInteractiveElement: PropTypes.func
};

function MoreMenuContent({ content, close }) {
  return (
    <ul
      className={locals.menu}
      onClick={e => {
        // Close the menu automatically on click on an element.
        // In order to avoid closing buttons and other interactive
        // elements may choose to disable propagation.
        e.stopPropagation();
        close();
      }}
    >
      {content}
    </ul>
  );
}
