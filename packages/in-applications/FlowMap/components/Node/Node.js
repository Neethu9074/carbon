/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import EntityInformation from 'in-applications/FlowMap/components/Node/components/EntityInformation';
import ScreenPositionWrapper from 'in-applications/FlowMap/components/Node/ScreenPositionWrapper';
import { ServiceLink, EndpointLink } from 'in-applications/FlowMap/components/Node/EntityLinks';

import locals from './Node.mless';

export default function Node(props) {
  const { node } = props;
  const nodeData = useObservable(node.events$.on('data'), [node]);
  const childList = useObservable(node.events$.on('children'), [node]);
  const isHeatMapEnabled = useObservable(node.events$.on('heatMapColor'), [node]);
  return (
    <ScreenPositionWrapper {...props}>
      {childList && childList.size > 0 ? (
        <EndpointListNode childList={childList} nodeData={nodeData} isHeatMapEnabled={isHeatMapEnabled} {...props} />
      ) : (
        <ServiceNode childList={childList} nodeData={nodeData} isHeatMapEnabled={isHeatMapEnabled} {...props} />
      )}
    </ScreenPositionWrapper>
  );
}

function ServiceNode(props) {
  return (
    <EntityInformation
      {...props}
      entity={props.node}
      Link={ServiceLink}
      expandLeft={props.expandNodeLeft}
      expandRight={props.expandNodeRight}
    />
  );
}

function EndpointListNode(props) {
  const { childList, node, nodeData, isHeatMapEnabled } = props;

  const childrenAsArray = [];
  const items = childList.values();
  for (const child of items) {
    childrenAsArray.push(child);
  }

  return (
    <ul className={locals.childList}>
      <div
        className={classNames({
          [locals.serviceLabel]: true,
          [locals.serviceLabelHeatMapEnabled]: isHeatMapEnabled
        })}
      >
        <SvgIcon className={locals.serviceIcon} type="lib_application_service" />
        {nodeData.label}
      </div>
      {childrenAsArray.map(child => (
        <li key={child.id} className={locals.childWrapper}>
          <EntityInformation
            {...props}
            entity={child}
            Link={EndpointLink}
            expandLeft={childId => props.expandChildLeft(node.id, childId)}
            expandRight={childId => props.expandChildRight(node.id, childId)}
          />
        </li>
      ))}
    </ul>
  );
}
