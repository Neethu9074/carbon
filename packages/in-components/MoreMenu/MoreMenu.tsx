/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button, ButtonKinds, ButtonSizes } from '@instana/components';

import { stopPropagation } from 'in-services/util/function';
import Overlay from 'in-components/overlays/Overlay';

import locals from './MoreMenu.mless';

export interface MoreMenuProps {
  children: React.ReactNode;
  className?: string;
  kind?: keyof typeof ButtonKinds;
  size?: keyof typeof ButtonSizes;
  /**
   * Renders a custom element to open the menu.
   * Use this if you need some kind of different button etc.
   */
  renderInteractiveElement?: (props: InteractiveElementsProps) => React.ReactNode;
}

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
  renderInteractiveElement
}: MoreMenuProps) {
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
          // @ts-expect-error This component will be used as a wrapper. "prop children is missing" error can be ignored here
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
