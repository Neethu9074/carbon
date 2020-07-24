import React from 'react';

import SourceDestinationSelectorOverlay from 'in-new-components/QueryBuilder/SourceDestinationSelectorOverlay/SourceDestinationSelectorOverlay';
import { SOURCE, DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Entity.mless';

export default function Entity({ entity, onChange, renderModelIndex }) {
  if (entity === SOURCE || entity === DESTINATION) {
    return (
      <Overlay
        withoutWrapper
        content={SourceDestinationSelectorOverlay}
        props={{ value: entity, onChange }}
        onCloseSideEffect={e => {
          // Ensure the element retains its focus when closing the overlay with the escape key.
          if (e instanceof KeyboardEvent) {
            focus(renderModelIndex);
          }
        }}
      >
        {({ toggle, refSetter }) => (
          <SvgIcon
            className={locals.icon}
            type={entity === SOURCE ? 'lib_application_call_source' : 'lib_application_call_destination'}
            refSetter={refSetter}
            onClick={toggle}
          />
        )}
      </Overlay>
    );
  }
  return null;
}
