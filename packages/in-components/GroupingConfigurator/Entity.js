/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';

import { SvgIcon } from '@instana/components';

import SourceDestinationSelectorOverlay from 'in-components/QueryBuilder/SourceDestinationSelectorOverlay/SourceDestinationSelectorOverlay';
import { SOURCE } from 'in-components/QueryBuilder/tagFilter/entities';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './GroupingConfigurator.mless';

export default function Entity({ groupbyTagEntity, onChange, sourceEnabled = true, destinationEnabled = true }) {
  const ref = useRef();

  return (
    <Overlay
      withoutWrapper
      content={SourceDestinationSelectorOverlay}
      props={{ value: groupbyTagEntity, onChange, sourceEnabled, destinationEnabled }}
      align="bottomMiddle"
      onCloseSideEffect={() => ref.current?.focus()}
    >
      {({ toggle, refSetter }) => (
        <>
          <SvgIcon
            className={locals.entityIcon}
            size="xs"
            type={groupbyTagEntity === SOURCE ? 'lib_arrow_outgoing' : 'lib_arrow_incoming'}
            refSetter={compositeRef(refSetter, ref)}
            onClick={toggle}
          />
          <div onClick={toggle} className={locals.srcDest}>
            {groupbyTagEntity === SOURCE
              ? t('in-components:queryBuilder.sourceAbbreviated')
              : t('in-components:queryBuilder.destinationAbbreviated')}
          </div>
        </>
      )}
    </Overlay>
  );
}
