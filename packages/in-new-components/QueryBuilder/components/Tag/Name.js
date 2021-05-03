/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { toInteractiveElement } from '@instana/components';
import { SvgIcon } from '@instana/components';

import ConjunctionTagSelectorOverlay from 'in-new-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionTagSelectorOverlay';
import Overlay from 'in-new-components/overlays/Overlay';
import { compositeRef } from 'in-services/util/react';

import locals from './Name.mless';

export default React.forwardRef(function Name(
  {
    tagCatalog,
    onChange,
    focus,
    element: { name, renderModelIndex },
    withoutOrConjunction = false,
    withoutBrackets = false
  },
  ref
) {
  const tagTreeNode = tagCatalog.tagsByName[name];
  const path = tagTreeNode?.path;

  if (!path) {
    return null;
  }

  return (
    <Overlay
      content={ConjunctionTagSelectorOverlay}
      props={{
        tagCatalog,
        onChange,
        withoutOrConjunction,
        withoutBrackets
      }}
      align="bottomMiddle"
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus(renderModelIndex);
        }
      }}
      withoutWrapper
    >
      {({ toggle, refSetter }) => (
        <div
          className={locals.name}
          {...toInteractiveElement({
            onDefaultInteraction: () => toggle()
          })}
          ref={compositeRef(refSetter, ref)}
        >
          {path
            .slice(0, path.length - 1)
            .map(node => node.label)
            .join(' ')}
          <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
          {path[path.length - 1].label}
        </div>
      )}
    </Overlay>
  );
});
