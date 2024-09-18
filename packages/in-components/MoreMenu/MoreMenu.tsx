/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { MoreMenu as CarbonMoreMenu, MoreMenuProps, Button } from '@instana/components';

import { carbonMoreMenuEnabled } from 'in-services/featureFlags';
import { stopPropagation } from 'in-services/util/function';
import Overlay from 'in-components/overlays/Overlay';

import locals from './MoreMenu.mless';

export interface InteractiveElementsProps {
  ref: React.MutableRefObject<HTMLElement> | undefined;
  toggle: () => void;
}

interface MoreMenuContentProps {
  content: React.ReactNode;
  close: () => void;
}

export default function MoreMenu({
  children,
  kind = 'secondary',
  size = 'normal',
  className = '',
  renderInteractiveElement,
  ...props
}: MoreMenuProps) {
  if (carbonMoreMenuEnabled) {
    return (
      <CarbonMoreMenu
        kind={kind}
        size={size}
        className={className}
        renderInteractiveElement={renderInteractiveElement}
        {...props}
      >
        {children}
      </CarbonMoreMenu>
    );
  }
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
          // @ts-expect-error children not defined
          <Button
            className={classNames(locals.button, className)}
            onClick={e => {
              stopPropagation(e as React.MouseEvent<HTMLElement>);
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

function MoreMenuContent({ content, close }: MoreMenuContentProps) {
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
