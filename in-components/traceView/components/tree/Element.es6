import React from 'react';

import TreeStackTraceElement from 'in-components/traceView/components/tree/StackTraceElement';
import TreeNetworkElement from 'in-components/traceView/components/tree/NetworkElement';
import TreeSpanElement from 'in-components/traceView/components/tree/SpanElement';

import './Element.less';

const block = 'in-trace-tree-element';

export default function TraceTreeElement({parentSpanForPercentageCalculation, element, trace}) {
  let newParentSpanForPercentageCalculation = parentSpanForPercentageCalculation;
  if (element.type === 'span' && parentSpanForPercentageCalculation.get('async')) {
    newParentSpanForPercentageCalculation = element.span;
  }

  const elementType = element.type;
  let details;
  if (elementType === 'span') {
    details = (
      <TreeSpanElement trace={trace}
                       span={element.span}
                       parentSpanForPercentageCalculation={parentSpanForPercentageCalculation}
                       parent={parent} />
    );
  } else if (elementType === 'stackTrace') {
    details = (
      <TreeStackTraceElement stackTrace={element.stackTrace}
                             parent={parent} />
    );
  } else if (elementType === 'network') {
    details = (
      <TreeNetworkElement parent={parent}
                          element={element} />
    );
  } else {
    throw new Error(`Unknown long trace element type ${element.type}`);
  }

  return (
    <li className={block}>
      {details}

      <ul>
        {element.children.map(childElement =>
          <TraceTreeElement element={childElement}
                            key={childElement.id}
                            parentSpanForPercentageCalculation={newParentSpanForPercentageCalculation}
                            trace={trace}
                            parent={element} />
        )}
      </ul>
    </li>
  );
}
