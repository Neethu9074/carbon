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

export default function Entity({ groupbyTagEntity, onChange }) {
  const ref = useRef();

  return (
    <Overlay
      withoutWrapper
      content={SourceDestinationSelectorOverlay}
      props={{ value: groupbyTagEntity, onChange }}
      align="bottomMiddle"
      onCloseSideEffect={() => ref.current?.focus()}
    >
      {({ toggle, refSetter }) => (
        <SvgIcon
          className={locals.entityIcon}
          type={groupbyTagEntity === SOURCE ? 'lib_application_call_source' : 'lib_application_call_destination'}
          refSetter={compositeRef(refSetter, ref)}
          onClick={toggle}
        />
      )}
    </Overlay>
  );
}
