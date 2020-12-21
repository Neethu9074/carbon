import React, { Fragment } from 'react';

import { serializeLine } from 'in-new-components/StackTrace/serializer';
import classNames from 'classnames';
import { isNotBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';

import locals from './StackTraceLine.mless';

export default function StackTraceLine({ file, name, line, column, indicator }) {
  return (
    <li className={locals.wrapper}>
      <Tooltip content={serializeLine(file, name, line, column)} align="topMiddle">
        <div className={locals.line}>
          {isNotBlank(name) && <Value text={name} className={locals.name} />}
          {isNotBlank(file) && (
            <Fragment>
              {isNotBlank(name) && <Filler text=" in " />}
              <Value text={file} className={locals.file} />
            </Fragment>
          )}

          {line > 0 && (
            <Fragment>
              <Filler text=" at " />
              <Value text={String(line)} noShrinking />

              {column > 0 && (
                <Fragment>
                  <Filler text=":" withoutExtraWhitespace />
                  <Value text={String(column)} noShrinking />
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </Tooltip>

      {indicator}
    </li>
  );
}

function Value({ text, noShrinking, className }) {
  return (
    <span
      className={classNames({
        [locals.value]: true,
        [locals.noShrinking]: noShrinking,
        [className]: className
      })}
    >
      {text}
    </span>
  );
}

function Filler({ text, withoutExtraWhitespace }) {
  return (
    <span
      className={classNames({
        [locals.filler]: true,
        [locals.withoutExtraWhitespace]: withoutExtraWhitespace
      })}
    >
      {text}
    </span>
  );
}
