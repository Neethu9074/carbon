import {create} from 'reactive-observables';
import React from 'react';

import createAgentResponseObservable from 'in-services/subscription/agentResponse';
import CodeRetrievalDialog from 'in-components/CodeRetrievalDialog';
import http from 'in-services/http';


export function getCodeView(snapshot, file, line) {
  return (
    <CodeRetrievalDialog snapshot={snapshot}
                         file={file}
                         line={line}
                         agentResponse$={getCode(snapshot, file)}
                         lang='javascript' />
  );
}

function getCode(snapshot, file) {
  if (!isPartOfStandardLibrary(file)) {
    return createAgentResponseObservable({
     action: 'node.source',
     target: snapshot.get('volatileId'),
     args: {
       file
     }
   });
  }

  const version = snapshot.getIn(['data', 'versions', 'node']);
  const base = http({
    method: 'GET',
    url: `https://raw.githubusercontent.com/nodejs/node/v${version}/lib/${file}`,
    responseType: 'text'
  });

  return create()
    .merge(base.map(content => {
      return {
        data: content.body
      };
    }))
    .merge(base.errors().map(err => {
      return {
        error: `Source code for file ${file} could not be retrieved. Error: ${err.message}`
      };
    }));
}


function isPartOfStandardLibrary(file) {
  return file.match(/^\//i) == null;
}
