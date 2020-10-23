import { combineLatest } from 'reactive-observables';
import React from 'react';

import ScreenPositionWrapper from 'in-applications/FlowMap/components/Node/ScreenPositionWrapper';
import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { alwaysNull } from 'in-services/fixedStreams';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './RemainingNodesPlaceholderNode.mless';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const paginationInformation$ = props.node.events$.on('paginationInformation');

    const connectedNodeConfig$ = combineLatest([
      paginationInformation$,
      getServiceLocators(props.serviceLocatorUid).nodesServiceLocator.getNodes().stream
    ])
      .map(([paginationInformation, currentNodes]) => {
        const connectedNode = currentNodes.get(paginationInformation.connectedNode.id);
        if (!connectedNode) {
          return null;
        }
        return {
          connectedNode,
          isLoading$: connectedNode.events$.on(`isLoadingData_${paginationInformation.direction}`).distinct(),
          errors$: connectedNode.events$.on(`errors_${paginationInformation.direction}`).distinct()
        };
      })
      .distinct();

    return {
      paginationInformation: paginationInformation$,
      connectedNodeConfig: connectedNodeConfig$,
      isLoading: connectedNodeConfig$.flatMap(config => (config ? config.isLoading$ : alwaysNull)),
      errors: connectedNodeConfig$.flatMap(config => (config ? config.errors$ : alwaysNull))
    };
  },
  function RemainingNodesPlaceholderNode(props) {
    const { isLoading, errors } = props;
    const hasErrors = errors && errors.length > 0;

    const onClickCallback = props.onClickCallback || defaultOnClick;
    const numRemainingNodes = props.paginationInformation.numRemainingNodes;
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
              onClickCallback(props);
            }}
          >
            Load {numRemainingNodes > pageSize ? pageSize : numRemainingNodes} more
            {numRemainingNodes > pageSize && (
              <span className={locals.totalReminaingNodesLabel}>(total: {numRemainingNodes})</span>
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
);

function defaultOnClick({ connectedNodeConfig, paginationInformation, loadMore }) {
  if (!connectedNodeConfig) {
    return;
  }

  loadMore({
    nodeId: connectedNodeConfig.connectedNode.id,
    direction: paginationInformation.direction,
    cursor: paginationInformation.cursor
  });
}
