import React from 'react';

import EntityInformation from 'in-components/EntityInformation';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { getEntitySnapshot$BySpan } from 'in-stores/traces';
import SvgIcon from 'in-components/SvgIcon';
import { SPAN_KINDS } from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';

import './SpanPhysicalEntitiesInformation.less';

const block = 'in-trace-tree-span-physical';

export default connectTo(
  props => {
    return {
      source: getEntitySnapshot$BySpan(props.span, 'source', { useLoadingPlaceholder: false }),
      destination: getEntitySnapshot$BySpan(props.span, 'destination', { useLoadingPlaceholder: false })
    };
  },
  function SpanPhysicalEntitiesInformation({ span, borderColor, source, destination }) {
    const isEntry = span.get('kind') === SPAN_KINDS.ENTRY;

    return (
      <div
        className={block}
        style={{
          borderColor
        }}
      >
        <span className={`${block}__heading`}>Instance:</span>

        <Component
          span={span}
          label={isEntry ? 'From:' : null}
          snapshot={source}
          endpointLabel={span.get('sourceEndpointLabel')}
        />
        <Component
          span={span}
          label={isEntry ? null : 'To:'}
          addEntryIcon={!!source}
          snapshot={destination}
          endpointLabel={span.get('destinationEndpointLabel')}
        />
      </div>
    );
  }
);

function Component({ span, label, snapshot, addEntryIcon }) {
  if (!snapshot) {
    return null;
  }

  return (
    <div>
      {addEntryIcon ? (
        <SvgIcon className={`${block}__icon`} type="corner_arrow_right" width={10} color="#92a5ae" />
      ) : null}
      <EntityInformation
        snapshotId={snapshot.get('id')}
        timeConfig={getTimeConfigAtMoment(span.get('start'))}
        label={label}
      />
    </div>
  );
}
