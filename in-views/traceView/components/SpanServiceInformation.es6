import React from 'react';

import EntityInformation from 'in-components/EntityInformation';
import {getEntitySnapshot$BySpan} from 'in-stores/traces';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getDirection} from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';

import './SpanServiceInformation.less';


const block = 'in-trace-tree-span-service-information';

export default connectTo(props => {
  const sourceId = props.span.getIn(['rels', 'sourceServiceId']);
  const destinationId = props.span.getIn(['rels', 'destinationServiceId']);

  return {
    sourceServiceSnapshot: sourceId ? getSnapshot(sourceId) : alwaysNull,
    sourceEntitySnapshot: getEntitySnapshot$BySpan(props.span, 'source'),
    destinationServiceSnapshot: destinationId ? getSnapshot(destinationId) : alwaysNull,
    destinationEntitySnapshot: getEntitySnapshot$BySpan(props.span, 'destination'),
  };
},
function SpanServiceInformation({span, borderColor, sourceServiceSnapshot, sourceEntitySnapshot, destinationServiceSnapshot, destinationEntitySnapshot}) {
  if (!sourceServiceSnapshot && !destinationServiceSnapshot && !sourceEntitySnapshot && !destinationEntitySnapshot) {
    return null;
  }

  const isEntry = getDirection(span) === 'entry';

  return (
    <div className={block}
         style={{
           borderColor
         }}>

      <span className={`${block}__heading`}>
        Services:
      </span>

      <Service label={isEntry ? 'From:' : null}
               entitySnapshot={sourceEntitySnapshot}
               snapshot={sourceServiceSnapshot} />
      <Service label={isEntry ? null : 'To:'}
               entitySnapshot={destinationEntitySnapshot}
               snapshot={destinationServiceSnapshot} />
    </div>
  );
});

function Service({label, snapshot, entitySnapshot}) {
  if (!snapshot || !entitySnapshot) {
    return null;
  }

  return (
    <div>
      <EntityInformation snapshot={snapshot}
                         label={label} />
    </div>
  );
}
