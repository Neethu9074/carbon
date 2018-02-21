import React from 'react';

import { serviceId as matrixServiceId } from 'in-applications/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Node.mless';

export default connectTo(
  props => ({
    screenPosition: props.node.events$.on('screenPosition'),
    data: props.node.events$.on('data')
  }),
  function Node({ node, screenPosition, data, size, isRootNode }) {
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
        <div className={`${getNodeClasses(isRootNode)} ${locals[size]}`}>
          {getContent(data, size)}
          <ExpandIcon
            className={locals.expandButtonLeft}
            direction="incoming"
            events$={node.events$}
            onClick={() => node.expandLeft()}
          />
          <ExpandIcon
            className={locals.expandButtonRight}
            direction="outgoing"
            events$={node.events$}
            onClick={() => node.expandRight()}
          />
        </div>
      </div>
    );
  }
);

const ExpandIcon = connectTo(
  props => ({
    isLoading: props.events$.on(`isLoadingData_${props.direction}`).distinct(),
    isExpanded: props.events$.on(`isExpanded_${props.direction}`).distinct(),
    hasErrors: props.events$.on(`hasErrors_${props.direction}`).distinct()
  }),
  function ExpandIcon({ isLoading, isExpanded, hasErrors, onClick, className }) {
    if (isExpanded) {
      return null;
    }
    return (
      <Tooltip content={hasErrors ? 'shit happens ¯\\_(ツ)_/¯' : null}>
        <div
          className={evaluateClassNames({
            [className]: true,
            [locals.errorneousExpandIcon]: hasErrors
          })}
          onClick={onClick}
        >
          <SvgIcon type={isLoading ? 'spinner' : 'plus_without_frame'} height={isLoading ? 14 : 10} color="#ffffff" />
        </div>
      </Tooltip>
    );
  }
);

function getNodeClasses(isRootNode) {
  let classes = locals.node;
  if (isRootNode) {
    return `${classes} ${locals.selected}`;
  }
  return classes;
}

function getContent(data, size) {
  if (size === 'sm') {
    return <SmallNodeContent data={data} />;
  }
  return <MidNodeContent data={data} />;
}

function SmallNodeContent() {
  return <SvgIcon className={locals.pluginIcon} type="popup" height={12} color="#172429" />;
}

function MidNodeContent({ data }) {
  return [
    <div key={1} className={locals.line}>
      <SvgIcon className={locals.pluginIcon} type="popup" height={12} color="#172429" />
      <Link href$={getLinkToEntitiesFlowMap(data.id)}>{data.label}</Link>
      <SvgIcon className={locals.expandIcon} type="triangle_right" height={8} color="#BECCD2" />
    </div>,
    <div key={2} className={locals.line}>{`719 18ms 0%`}</div>
  ];
}

function getLinkToEntitiesFlowMap(id) {
  return getModifiedUrlStream(params => {
    const view = params.pathname.replace(/\/flowMap/, '');
    setOrDeleteMatrixKey(params, view, matrixServiceId, id);
  });
}
