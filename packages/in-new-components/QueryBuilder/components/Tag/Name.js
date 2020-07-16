import React from 'react';

import TagSelectorOverlay from 'in-new-components/QueryBuilder/TagSelectorOverlay/TagSelectorOverlay';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Name.mless';

export default function Name({ tagCatalog, onChange, focus, element: { name, renderModelIndex } }) {
  const tagTreeNode = tagCatalog.tagsByName[name];
  const path = tagTreeNode?.path;

  if (path) {
    return (
      <Overlay
        align="bottomMiddle"
        content={TagSelectorOverlay}
        props={{
          tagCatalog,
          onChange
        }}
        onCloseSideEffect={() => focus(renderModelIndex)}
        withoutWrapper
      >
        {({ toggle, refSetter }) => (
          <span className={locals.name} onClick={toggle} ref={refSetter}>
            {path
              .slice(0, path.length - 1)
              .map(node => node.label)
              .join(' ')}
            <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />
            {path[path.length - 1].label}
          </span>
        )}
      </Overlay>
    );
  }
  return <span className={locals.name}>{name}</span>;
}
