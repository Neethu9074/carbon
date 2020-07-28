import React from 'react';

import TagSelectorOverlay from 'in-new-components/QueryBuilder/TagSelectorOverlay/TagSelectorOverlay';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import Overlay from 'in-new-components/overlays/Overlay';
import { compositeRef } from 'in-services/util/react';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Name.mless';

export default React.forwardRef(function Name(
  { tagCatalog, onChange, focus, element: { name, renderModelIndex } },
  ref
) {
  const tagTreeNode = tagCatalog.tagsByName[name];
  const path = tagTreeNode?.path;

  if (!path) {
    return null;
  }

  return (
    <Overlay
      content={TagSelectorOverlay}
      props={{
        tagCatalog,
        onChange
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
          <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />
          {path[path.length - 1].label}
        </div>
      )}
    </Overlay>
  );
});
