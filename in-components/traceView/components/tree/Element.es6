import React from 'react';

import TreeStackTraceElement from 'in-components/traceView/components/tree/StackTraceElement';
import TreeNetworkElement from 'in-components/traceView/components/tree/NetworkElement';
import TreeSpanElement from 'in-components/traceView/components/tree/SpanElement';

import './Element.less';

const block = 'in-trace-tree-element';

export default function TraceTreeElement({parentSpanForPercentageCalculation, element, trace, depth, parent,
    totalTimeIndentationDepth}) {
  let newParentSpanForPercentageCalculation = parentSpanForPercentageCalculation;
  if (element.type === 'span' && parentSpanForPercentageCalculation.get('async')) {
    newParentSpanForPercentageCalculation = element.span;
  }

  if (element.type === 'span' && element.span.get('async')) {
    totalTimeIndentationDepth = depth;
  }

  const elementType = element.type;
  let details;
  if (elementType === 'span') {
    details = (
      <TreeSpanElement trace={trace}
                       span={element.span}
                       parentSpanForPercentageCalculation={parentSpanForPercentageCalculation}
                       parent={parent}
                       depth={depth}
                       totalTimeIndentationDepth={totalTimeIndentationDepth} />
    );
  } else if (elementType === 'stackTrace') {
    details = (
      <div style={{
             paddingLeft: `${depth * 20}px`
           }}>
        <TreeStackTraceElement stackTrace={element.stackTrace}
                               parent={parent} />
      </div>
    );
  } else if (elementType === 'network') {
    details = (
      <div style={{
             paddingLeft: `${depth * 20}px`
           }}>
        <TreeNetworkElement parent={parent}
                            element={element}/>
      </div>
    );
  } else {
    throw new Error(`Unknown long trace element type ${element.type}`);
  }

  const childDepth = depth + 1;

  return (
    <li className={block}>
      {details}

      <ul className='in-trace-view-tree__element-container'>
        {element.children.map(childElement =>
          <TraceTreeElement element={childElement}
                            key={childElement.id}
                            parentSpanForPercentageCalculation={newParentSpanForPercentageCalculation}
                            trace={trace}
                            parent={element}
                            depth={childDepth}
                            totalTimeIndentationDepth={totalTimeIndentationDepth} />
        )}
      </ul>
    </li>
  );
}
