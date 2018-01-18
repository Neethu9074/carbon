import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './Node.mless';

export default connectTo(
  props => ({
    screenPosition: props.node.events$.on('screenPosition')
  }),
  function Node({ node, screenPosition, size }) {
    if (!screenPosition) {
      return null;
    }

    return (
      <div
        className={locals.wrapper}
        style={{
          top: `${screenPosition.y * 100}%`,
          left: `${screenPosition.x * 100}%`
        }}
      >
        <div className={`${locals.node} ${locals[size]}`}>{getContent(node, size)}</div>
      </div>
    );
  }
);

function getContent(node, size) {
  if (size === 'sm') {
    return <SmallNodeContent node={node} />;
  } else if (size === 'mid') {
    return <MidNodeContent node={node} />;
  }
  return <LargeNodeContent node={node} />;
}

function SmallNodeContent() {
  return <SvgIcon className={locals.pluginIcon} type="popup" height={12} color="#172429" />;
}

function MidNodeContent({ node }) {
  return [
    <div key={1} className={locals.line}>
      <SvgIcon className={locals.pluginIcon} type="popup" height={12} color="#172429" />
      {node.id}
      <SvgIcon className={locals.expandIcon} type="triangle_right" height={8} color="#BECCD2" />
    </div>,
    <div key={2} className={locals.line}>{`719 18ms 0%`}</div>
  ];
}

function LargeNodeContent({ node }) {
  return [
    <div key={1} className={locals.line}>
      <SvgIcon className={locals.pluginIcon} type="popup" height={12} color="#172429" />
      {node.id}
      <SvgIcon className={locals.expandIcon} type="triangle_right" height={8} color="#BECCD2" />
    </div>,
    <div key={2} className={locals.line}>
      <SvgIcon type="crossed_circle" height={32} color="#BECCD2" />
    </div>,
    <div key={3} className={locals.line}>{`719 18ms 0%`}</div>
  ];
}
