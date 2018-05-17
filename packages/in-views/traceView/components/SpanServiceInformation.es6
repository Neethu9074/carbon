import React from 'react';

import EntityInformation from 'in-components/EntityInformation';
import { getEntitySnapshot$BySpan } from 'in-stores/traces';
import { getSnapshot } from 'in-stores/snapshot';
import { SPAN_KINDS } from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const sourceId = props.span.getIn(['rels', 'sourceServiceId']);
    const destinationId = props.span.getIn(['rels', 'destinationServiceId']);
    const start = props.span.get('start');

    return {
      sourceServiceSnapshot: getSnapshot(sourceId, start),
      sourceEntitySnapshot: getEntitySnapshot$BySpan(props.span, 'source'),
      destinationServiceSnapshot: getSnapshot(destinationId, start)
    };
  },
  function SpanServiceInformation({ span, sourceServiceSnapshot, sourceEntitySnapshot, destinationServiceSnapshot }) {
    if ((!sourceServiceSnapshot || !sourceEntitySnapshot) && !destinationServiceSnapshot) {
      return null;
    }

    const isEntry = span.get('kind') === SPAN_KINDS.ENTRY;

    return (
      <div>
        <Service
          span={span}
          label={isEntry ? 'From:' : null}
          snapshot={sourceServiceSnapshot}
          endpointLabel={span.get('sourceEndpointLabel')}
        />
        <Service
          span={span}
          label={isEntry ? null : 'To:'}
          snapshot={destinationServiceSnapshot}
          endpointLabel={span.get('destinationEndpointLabel')}
        />
      </div>
    );
  }
);

function Service({ span, label, snapshot, endpointLabel }) {
  if (!snapshot) {
    return null;
  }

  return (
    <EntityInformation
      entityId={snapshot.get('id')}
      time={span.get('start')}
      label={label}
      getLabelCallback={label => getServiceLabelWithEndpoint(label, endpointLabel)}
    />
  );
}

function getServiceLabelWithEndpoint(serviceLabel, endpointLabel) {
  if (endpointLabel) {
    return `${serviceLabel} : ${endpointLabel}`;
  }
  return serviceLabel;
}
