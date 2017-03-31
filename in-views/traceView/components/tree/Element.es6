import React from 'react';

import TreeStackTraceElement from 'in-views/traceView/components/tree/StackTraceElement';
import TreeNetworkElement from 'in-views/traceView/components/tree/NetworkElement';
import TreeSpanElement from 'in-views/traceView/components/tree/SpanElement';

import './Element.less';

const block = 'in-trace-tree-element';

export default function TraceTreeElement(
  {
    parentSpanForPercentageCalculation,
    element,
    trace,
    parentDepth,
    parent,
    totalTimeIndentationDepth
  }
) {
  let newParentSpanForPercentageCalculation = parentSpanForPercentageCalculation;
  if (element.type === 'span' && parentSpanForPercentageCalculation.get('async')) {
    newParentSpanForPercentageCalculation = element.span;
  }

  const elementType = element.type;
  let depth = parentDepth + 1;
  if (elementType === 'network' || (parent != null && parent.type === 'network')) {
    depth--;
  }

  if (element.type === 'span' && element.span.get('async')) {
    totalTimeIndentationDepth = depth;
  }

  let details;
  if (elementType === 'span') {
    details = (
      <TreeSpanElement
        trace={trace}
        span={element.span}
        parentSpanForPercentageCalculation={parentSpanForPercentageCalculation}
        parent={parent}
        depth={depth}
        totalTimeIndentationDepth={totalTimeIndentationDepth}
      />
    );
  } else if (elementType === 'stackTrace') {
    details = (
      <div
        style={{
          paddingLeft: `${depth * 20}px`
        }}
      >
        <TreeStackTraceElement stackTrace={element.stackTrace} parent={parent} parentSpan={element.parentSpan} />
      </div>
    );
  } else if (elementType === 'network') {
    details = (
      <div
        style={{
          paddingLeft: `${depth * 20}px`
        }}
      >
        <TreeNetworkElement
          parent={parent}
          parentSpanForPercentageCalculation={parentSpanForPercentageCalculation}
          element={element}
        />
      </div>
    );
  } else {
    throw new Error(`Unknown long trace element type ${element.type}`);
  }

  return (
    <li className={block}>
      {details}

      <ul className="in-trace-view-tree__element-container">
        {element.children.map((childElement, i) => (
          <TraceTreeElement
            element={childElement}
            key={i}
            parentSpanForPercentageCalculation={newParentSpanForPercentageCalculation}
            trace={trace}
            parent={element}
            parentDepth={depth}
            totalTimeIndentationDepth={totalTimeIndentationDepth}
          />
        ))}
      </ul>
    </li>
  );
}
