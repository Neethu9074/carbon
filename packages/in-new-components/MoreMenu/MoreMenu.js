/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { stopPropagation } from 'in-services/util/function';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';

import locals from './MoreMenu.mless';

export default function MoreMenu({ children, kind = 'secondary', size = 'normal', className }) {
  return (
    <Overlay
      withoutWrapper
      content={MoreMenuContent}
      props={{
        content: children
      }}
    >
      {({ toggle, refSetter }) => (
        <Button
          className={classNames(locals.button, className)}
          onClick={e => {
            stopPropagation(e);
            toggle();
          }}
          refSetter={refSetter}
          icon="lib_menu_more_horizontal"
          size={size}
          kind={kind}
        />
      )}
    </Overlay>
  );
}

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
