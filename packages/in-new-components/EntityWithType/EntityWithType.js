/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';

import { getPluginName } from 'in-sdk/pluginName';
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

const Content = forwardRef(function Content({ label, type, renderType, href$, addEllipsis }, ref) {
  return (
    <div className={locals.wrapper} ref={ref}>
      {type && (
        <div className={locals.type}>{renderType ? renderType(getPluginName(type, 1)) : getPluginName(type, 1)}</div>
      )}
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
});

const Label = ({ label, addEllipsis }) =>
  addEllipsis ? <div className={locals.withEllipsis}>{label}</div> : <span>{label}</span>;
