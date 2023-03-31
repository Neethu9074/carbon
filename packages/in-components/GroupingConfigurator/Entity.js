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
        <SvgIcon
          className={locals.entityIcon}
          type={groupbyTagEntity === SOURCE ? 'lib_arrow_incoming' : 'lib_arrow_outgoing'}
          refSetter={compositeRef(refSetter, ref)}
          onClick={toggle}
        />
      )}
    </Overlay>
  );
}
