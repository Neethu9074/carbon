/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { BoundaryScope, DependencyDirection } from '@instana/types';
import { SvgIcon, Button } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

//@ts-expect-error need TS migration
import ScreenPositionWrapper from 'in-applications/FlowMap/components/Node/ScreenPositionWrapper';
import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import { Node } from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/types';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { NodeCollection } from 'in-applications/ServerFlowMap/types';
import Tooltip from 'in-components/Tooltip';
import { Trans, t } from 'in-i18n';

import locals from 'in-applications/FlowMap/components/Node/RemainingNodesPlaceholderNode.mless';

interface PaginationInformation {
  connectedNode: NodeCollection;
  numRemainingNodes: number;
  direction: DependencyDirection;
  cursor: number;
}
interface ExpandChildProps {
  nodeId: string;
  childId?: string;
  cursor: number;
}

interface ConnectedNodeConfig {
  connectedNode: NodeCollection;
  errors$: Array<any>; //will replace in the following PRs
  isLoading$: boolean;
}

interface LoadMoreProps {
  nodeId: string;
  childId?: string;
  direction: DependencyDirection;
  cursor: number;
}

interface OnClickCallbackProps {
  serviceLocatorUid: string;
  node: Node;
  paginationInformation: PaginationInformation;
  loadMore: ({ nodeId, childId, direction, cursor }: LoadMoreProps) => void;
}
interface RemainingNodesPlaceholderNodeProps {
  applicationContext?: string;
  boundaryScope: BoundaryScope;
  expandChildLeft: ({ nodeId, childId, cursor }: ExpandChildProps) => void;
  expandChildRight: ({ nodeId, childId, cursor }: ExpandChildProps) => void;
  expandNodeLeft: ({ nodeId, cursor }: Omit<ExpandChildProps, 'childId'>) => void;
  expandNodeRight: ({ nodeId, cursor }: Omit<ExpandChildProps, 'childId'>) => void;
  loadMore: ({ nodeId, childId, direction, cursor }: ExpandChildProps & { direction: string }) => void;
  node: Node;
  nodes: Map<string, Node>;
  nodeSize: string;
  onClickCallback?: ({ serviceLocatorUid, node, paginationInformation, loadMore }: OnClickCallbackProps) => void;
  rootNodeId: string;
  serviceLocatorUid: string;
  size: string;
}

export default function RemainingNodesPlaceholderNode(props: RemainingNodesPlaceholderNodeProps) {
  const paginationInformation$ = props.node.events$.on('paginationInformation');
  const paginationInformation: PaginationInformation = useObservable(props.node.events$.on('paginationInformation'), [
    props.node
  ]) as PaginationInformation;
  const connectedNodeConfig =
    useObservable(
      combineLatest([
        paginationInformation$,
        getServiceLocators(props.serviceLocatorUid).nodesServiceLocator.getNodes().stream
      ])
        .map(([paginationInformation, currentNodes]: any) => {
          const connectedNode = currentNodes.get(paginationInformation.connectedNode?.id);
          if (!connectedNode) {
            return null;
          }
          return {
            connectedNode,
            isLoading$: connectedNode.events$.on(`isLoadingData_${paginationInformation.direction}`).distinct(),
            errors$: connectedNode.events$.on(`errors_${paginationInformation.direction}`).distinct()
          };
        })
        .distinct(),
      [props]
    ) ?? null;
  const isLoading = useObservable(connectedNodeConfig?.isLoading$, [connectedNodeConfig]);
  const errors = useObservable(connectedNodeConfig?.errors$, [connectedNodeConfig]);
  const hasErrors = Array.isArray(errors) && errors.length > 0;
  const onClickCallback = props.onClickCallback || defaultOnClick;
  const numRemainingNodes = paginationInformation?.numRemainingNodes;
  const pageSize = 10;
  return (
    <ScreenPositionWrapper {...props}>
      <div className={locals.wrapper}>
        <Button
          kind="action"
          size="compact"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onClickCallback({ ...props, connectedNodeConfig, paginationInformation });
          }}
        >
          {numRemainingNodes > pageSize ? (
            <Trans
              i18nKey="in-applications:flowMap.buttonLoadMoreWithRemain"
              values={{
                remainNumber: pageSize,
                nodeNumber: numRemainingNodes
              }}
              components={{ totalSpan: <span className={locals.totalReminaingNodesLabel} /> }}
            />
          ) : (
            t('in-applications:flowMap.buttonLoadMore', {
              remainNumber: numRemainingNodes
            })
          )}
        </Button>
        {isLoading && <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning />}
        {hasErrors && (
          <Tooltip content={<ErroneousResultPresenter errors={errors} />}>
            <SvgIcon className={locals.errorIcon} type="lib_help_error_warning" />
          </Tooltip>
        )}
      </div>
    </ScreenPositionWrapper>
  );
}

interface DefaultOnClickProps {
  connectedNodeConfig: ConnectedNodeConfig | null;
  paginationInformation: PaginationInformation;
  loadMore: ({ nodeId, direction, cursor }: LoadMoreProps) => void;
}

function defaultOnClick({ connectedNodeConfig, paginationInformation, loadMore }: DefaultOnClickProps) {
  if (!connectedNodeConfig) {
    return;
  }

  loadMore({
    nodeId: connectedNodeConfig.connectedNode?.id,
    direction: paginationInformation.direction,
    cursor: paginationInformation.cursor
  });
}
