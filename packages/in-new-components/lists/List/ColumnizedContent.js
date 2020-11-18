import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './ColumnizedContent.mless';

export default function ColumnizedContent(props) {
  const { columnDefinitions } = props;

  return (
    <>
      {columnDefinitions.map(({ width, minWidth = width, getContent, shrink = true }, i) => (
        <div
          key={i}
          style={{
            minWidth: minWidth,
            maxWidth: width,
            flexShrink: shrink ? 1 : 0,
            overflow: shrink ? 'auto' : 'visible'
          }}
          className={evaluateClassNames({
            [locals.flexColumn]: !width
          })}
        >
          {getContent(props)}
        </div>
      ))}
    </>
  );
}
