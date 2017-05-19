import React from 'react';

import EntityInformation from 'in-components/EntityInformation';
import { getEntitySnapshot$BySpan } from 'in-stores/traces';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { SPAN_KINDS } from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';

import './SpanServiceInformation.less';

const block = 'in-trace-tree-span-service-information';

export default connectTo(
  props => {
    const sourceId = props.span.getIn(['rels', 'sourceServiceId']);
    const destinationId = props.span.getIn(['rels', 'destinationServiceId']);

    return {
      sourceServiceSnapshot: sourceId ? getSnapshot(sourceId) : alwaysNull,
      sourceEntitySnapshot: getEntitySnapshot$BySpan(props.span, 'source'),
      destinationServiceSnapshot: destinationId ? getSnapshot(destinationId) : alwaysNull,
      destinationEntitySnapshot: getEntitySnapshot$BySpan(props.span, 'destination')
    };
  },
  function SpanServiceInformation({
    span,
    borderColor,
    sourceServiceSnapshot,
    sourceEntitySnapshot,
    destinationServiceSnapshot,
    destinationEntitySnapshot
  }) {
    if (
      (!sourceServiceSnapshot || !sourceEntitySnapshot) &&
      (!destinationServiceSnapshot || !destinationEntitySnapshot)
    ) {
      return null;
    }

    const isEntry = span.get('kind') === SPAN_KINDS.ENTRY;

    return (
      <div
        className={block}
        style={{
          borderColor
        }}
      >

        <span className={`${block}__heading`}>
          Services:
        </span>

        <Service
          label={isEntry ? 'From:' : null}
          entitySnapshot={sourceEntitySnapshot}
          snapshot={sourceServiceSnapshot}
          endpointLabelPath="source_endpoint_label"
        />
        <Service
          label={isEntry ? null : 'To:'}
          addEntryIcon={sourceEntitySnapshot && sourceServiceSnapshot ? true : false}
          entitySnapshot={destinationEntitySnapshot}
          snapshot={destinationServiceSnapshot}
          endpointLabelPath="destination_endpoint_label"
        />
      </div>
    );
  }
);

function Service({ label, snapshot, entitySnapshot, addEntryIcon, endpointLabelPath }) {
  if (!snapshot || !entitySnapshot) {
    return null;
  }

  return (
    <div>
      {addEntryIcon
        ? <SvgIcon className={`${block}__icon`} type="corner_arrow_right" width={10} color="#92a5ae" />
        : null}
      <EntityInformation
        snapshot={snapshot}
        label={label}
        getLabelCallback={(label, snapshot) => getServiceLabelWithEndpoint(label, snapshot, endpointLabelPath)}
      />
    </div>
  );
}

function getServiceLabelWithEndpoint(serviceLabel, snapshot, endpointLabelPath) {
  const endpointLabel = snapshot.get(endpointLabelPath);
  if (endpointLabel) {
    return `${serviceLabel} : ${snapshot.get('id')}`;
  }
  return serviceLabel;
}
