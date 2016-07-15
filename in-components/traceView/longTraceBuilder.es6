export function transform(span) {
  const result = {
    spanId: span.spanId,
    type: 'span',
    children: []
  };

  span.childSpans.forEach(childSpan => {
    insertSpanIntoParent(result, childSpan);
  });

  return result;
}


function insertSpanIntoParent(parentResult, span) {
  if (!span.stackTrace) {
    return;
  }

  let currentParent = parentResult;

  span.stackTrace
    .slice()
    .reverse()
    .forEach(stackTraceElement => {
      currentParent = getOrAddStackTraceElementToParent(stackTraceElement);
    });

  currentParent.children.push(transform(span));

  function getOrAddStackTraceElementToParent(stackTraceElement) {
    const id = stringifyStackTraceElement(stackTraceElement);

    for (let i = 0, len = currentParent.children.length; i < len; i++) {
      const child = currentParent.children[i];
      if (child.stackTraceElementId === id) {
        return child;
      }
    }

    const newParent = {
      type: 'stackTraceElement',
      stackTraceElementId: id,
      stackTrace: stackTraceElement,
      children: []
    };
    currentParent.children.push(newParent);
    return newParent;
  }
}


function stringifyStackTraceElement(stackTraceElement) {
  const result = `${stackTraceElement.c}#${stackTraceElement.m}`;
  if (!stackTraceElement.n) {
    return result;
  }
  return `${result}:${stackTraceElement.n}`;
}
