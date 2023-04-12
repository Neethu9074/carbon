/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import SourceDestinationSelectorOverlay from 'in-components/QueryBuilder/SourceDestinationSelectorOverlay/SourceDestinationSelectorOverlay';
import { SOURCE, DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './Entity.mless';

export default React.forwardRef(function Entity(
  { entity, onChange, renderModelIndex, focus, sourceEnabled, destinationEnabled },
  ref
) {
  if (entity === SOURCE || entity === DESTINATION) {
    return (
      <Overlay
        withoutWrapper
        content={SourceDestinationSelectorOverlay}
        props={{ value: entity, onChange, sourceEnabled, destinationEnabled }}
        align="bottomMiddle"
        onCloseSideEffect={e => {
          // Ensure the element retains its focus when closing the overlay with the escape key.
          if (e instanceof KeyboardEvent) {
            focus(renderModelIndex);
          }
        }}
      >
        {({ toggle, refSetter }) => (
          <>
            <div className={locals.wrapper}>
              <SvgIcon
                size="xs"
                className={locals.icon}
                type={entity === SOURCE ? 'lib_arrow_outgoing' : 'lib_arrow_incoming'}
                refSetter={compositeRef(refSetter, ref)}
                onClick={toggle}
              />
            </div>
            <div onClick={toggle} className={locals.name}>
              {entity === SOURCE
                ? t('in-components:queryBuilder.sourceAbbreviated')
                : t('in-components:queryBuilder.destinationAbbreviated')}
            </div>
          </>
        )}
      </Overlay>
    );
  }
  return null;
});
