import React from 'react';

import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './Node.mless';

export default function Node({ node, nodeProps = {} }) {
  const x = node.x0 - node.parent.x0;
  const y = node.y0 - node.parent.y0;
  const width = node.x1 - node.x0;
  const height = node.y1 - node.y0;
  const showLabel = width > 100 && height > 48;
  const showMetricValue = width > 50 && height > 16;

  let content = (
    <div
      style={{
        left: x,
        top: y,
        width,
        height,
        background: nodeProps.getColor && nodeProps.getColor(node)
      }}
      className={locals.node}
      onClick={() => nodeProps.onClick && nodeProps.onClick(node)}
    >
      <span className={locals.label}>{showLabel ? node.data.label : node.data.label && '...'}</span>
      {showMetricValue && <span className={locals.value}>{node.data.valueLabel}</span>}
    </div>
  );

  if (nodeProps.getHref$) {
    content = <Link href$={nodeProps.getHref$(node)}>{content}</Link>;
  }

  if (nodeProps.renderTooltip) {
    content = (
      <Tooltip themeStyle="light" content={nodeProps.renderTooltip(node, showMetricValue)} align="mousePosition">
        {content}
      </Tooltip>
    );
  }

  return content;
}
