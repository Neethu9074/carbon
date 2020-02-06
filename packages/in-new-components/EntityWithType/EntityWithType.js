import React from 'react';

import { getSingular } from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './EntityWithType.mless';

export default function EntityWithType({ addTooltip, ...props }) {
  return addTooltip ? (
    <Tooltip content={props.label} align="bottomMiddle">
      <Content {...props} />
    </Tooltip>
  ) : (
    <Content {...props} />
  );
}

const Content = ({ label, type, renderType, href$, addEllipsis }) => (
  <div className={locals.wrapper}>
    <div className={locals.type}>{renderType ? renderType(getSingular(type)) : getSingular(type)}</div>
    {href$ ? (
      <Link className={locals.link} href$={href$}>
        <Label label={label} addEllipsis={addEllipsis} />
      </Link>
    ) : (
      <span className={locals.label}>
        <Label label={label} addEllipsis={addEllipsis} />
      </span>
    )}
  </div>
);

const Label = ({ label, addEllipsis }) =>
  addEllipsis ? <div className={locals.withEllipsis}>{label}</div> : <span>{label}</span>;
