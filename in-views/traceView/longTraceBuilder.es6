import {getDirection} from 'in-sdk/tracing';

export function transform(span) {
  const result = {
    id: span.get('spanId'),
    type: 'span',
    span,
    children: []
  };


  const childSpans = span.get('childSpans');
  let parentForChildren = result;
  if (getDirection(span) === 'exit' && childSpans.size > 0) {
    parentForChildren = {
      id: '-1',
      type: 'network',
      children: []
    };
    result.children.push(parentForChildren);
  }

  childSpans.forEach(childSpan => {
    insertSpanIntoParent(parentForChildren, childSpan, span);
  });

  return result;
}


function insertSpanIntoParent(parentResult, span, parentSpan) {
  let currentParent = parentResult;

  if (getDirection(span) !== 'entry') {
    withoutDuplicatatedStackTraceLines(parentSpan.get('stackTrace'), span.get('stackTrace'))
      .reverse()
      .forEach(stackTraceElement => {
        currentParent = getOrAddStackTraceElementToParent(stackTraceElement);
      });
  }

  currentParent.children.push(transform(span));

  function getOrAddStackTraceElementToParent(stackTraceElement) {
    const id = stringifyStackTraceElement(stackTraceElement);

    for (let i = 0, len = currentParent.children.length; i < len; i++) {
      const child = currentParent.children[i];
      if (child.type === 'stackTrace' && child.id === id) {
        child.spans.push(span);
        return child;
      }
    }

    const newParent = {
      id: id,
      type: 'stackTrace',
      stackTrace: [stackTraceElement],
      spans: [span],
      parentSpan,
      children: []
    };
    currentParent.children.push(newParent);
    return newParent;
  }
}


export function withoutDuplicatatedStackTraceLines(parentSpanStackTrace, spanStackTrace) {
  let result = spanStackTrace.toArray();

  parentSpanStackTrace.forEach(parentStackTraceElement => {
    let splitPoint;
    for (let i = 0, len = result.length; i < len && splitPoint == null; i++) {
      const childStackTraceElement = result[i];
      if (childStackTraceElement.get('c') === parentStackTraceElement.get('c') &&
          childStackTraceElement.get('m') === parentStackTraceElement.get('m') &&
          childStackTraceElement.get('n') === parentStackTraceElement.get('n')) {
        splitPoint = i;
      }
    }

    if (splitPoint != null) {
      result = result.slice(0, splitPoint);
    }
  });

  return result;
}


function stringifyStackTraceElement(stackTraceElement) {
  const result = `${stackTraceElement.get('c')}#${stackTraceElement.get('m')}`;
  const n = stackTraceElement.get('n');
  if (!n) {
    return result;
  }
  return `${result}:${n}`;
}
