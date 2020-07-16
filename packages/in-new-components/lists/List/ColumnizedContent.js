import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './ColumnizedContent.mless';

export default function ColumnizedContent(props) {
  const { columnDefinitions } = props;

  return (
    <>
      {columnDefinitions.map(({ width, getContent }, i) => (
        <div
          key={i}
          style={{ minWidth: width, maxWidth: width }}
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
