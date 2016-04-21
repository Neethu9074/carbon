import React from 'react';

export default function HttpSpanDetailView({span}) {
  const url = span.getIn(['data', 'http', 'url']);
  const method = span.getIn(['data', 'http', 'method']);
  let content;

  if (url && method) {
    content = method + ' ' + url;
  } else if (url) {
    content = url;
  } else if (method) {
    content = method;
  }

  if (content) {
    return <div>{content}</div>;
  }

  return <div />;
}
