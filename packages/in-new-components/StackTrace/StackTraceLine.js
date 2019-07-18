import React, { Fragment } from 'react';

import { isNotBlank } from 'in-services/util/string';
import { evaluateClassNames } from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';

import locals from './StackTraceLine.mless';

export default function StackTraceLine({ file, name, line, column, additionalContent }) {
  return (
    <li className={locals.line}>
      {isNotBlank(name) && <ValueWithTooltip text={name} className={locals.name} />}
      {isNotBlank(file) && (
        <Fragment>
          {isNotBlank(name) && <Filler text=" in " />}
          <ValueWithTooltip text={file} className={locals.file} />
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

      {additionalContent && <Fragment> {additionalContent}</Fragment>}
    </li>
  );
}

function ValueWithTooltip({ text, className }) {
  return (
    <Tooltip content={text} align="bottomMiddle">
      <Value text={text} className={className} />
    </Tooltip>
  );
}

function Value({ text, noShrinking, className }) {
  return (
    <span
      className={evaluateClassNames({
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
      className={evaluateClassNames({
        [locals.filler]: true,
        [locals.withoutExtraWhitespace]: withoutExtraWhitespace
      })}
    >
      {text}
    </span>
  );
}
