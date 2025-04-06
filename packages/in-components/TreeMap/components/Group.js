/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import Node from 'in-components/TreeMap/components/Node';
import Tooltip from 'in-components/Tooltip';

import locals from './Group.mless';

export default function Group({ group, groupProps = {}, nodeProps }) {
  const width = group.x1 - group.x0;
  const height = group.y1 - group.y0;
  const showLabel = width > 100;
  const showMetricValue = width > 50;

  let headerContent = (
    <div className={locals.header}>
      {showLabel && <span className={locals.label}>{group.data.label}</span>}
      {showMetricValue && <span className={locals.value}>{group.data.valueLabel}</span>}
      <div className={locals.hoverLayer} />
    </div>
  );

  if (groupProps.getHref$) {
    headerContent = (
      <Link className={locals.link} href={groupProps.getHref$(group)}>
        {headerContent}
      </Link>
    );
  }

  if (groupProps.renderTooltip) {
    headerContent = (
      <Tooltip
        themeStyle="light"
        content={groupProps.renderTooltip(group, showMetricValue)}
        align="mousePosition"
        forceTheme
        overwriteBlock
      >
        {headerContent}
      </Tooltip>
    );
  }

  return (
    <div style={{ top: group.y0, left: group.x0, width, height }} className={locals.group}>
      {headerContent}
      {group.children.map(node => (
        <Node key={node.data.id} node={node} nodeProps={nodeProps} />
      ))}
    </div>
  );
}
