/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon, Button } from '@instana/components';
import { themes } from '@instana/design-tokens';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { bizopsDeployAgentClick } from 'in-bizops/tracker';

import locals from './BizOpsEmptyTableState.mless';

export default function BizOpsEmptyTableState(extraProps: any) {
  const ExtendedServerTableWithEmptyState = (props: any) => <ServerTableWithEmptyState {...props} {...extraProps} />;
  ExtendedServerTableWithEmptyState.displayName = 'ExtendedServerTableWithEmptyState';
  return ExtendedServerTableWithEmptyState;
}

function ServerTableWithEmptyState(props: any) {
  return <ServerTablePresenter {...props} renderNoDataAvailable={() => NoDataAvailable(props.href)} />;
}

function NoDataAvailable(href: string) {
  const { location } = useNavigation();
  const trackerProps = {
    path: location.pathname,
    location: 'empty table state'
  };
  return (
    <CenterAlignmentColumn>
      <div className={locals.bizopsNoData}>
        <SvgIcon type={'lib_bizops'} size="xxl" color={themes.default.ids.color.option.neutral['700']} />
        <p>
          No business processes are available.
          <br />
          You need to deploy an agent first.
          <br />
          For more information, read the{' '}
          <a href="https://www.ibm.com/docs/en/instana-observability/current?topic=instana-business-monitoring">
            documentation
          </a>
        </p>
      </div>
      <Button
        kind="primary"
        href={href}
        className={locals.bizopsDeployAgent}
        onClick={() => bizopsDeployAgentClick(trackerProps)}
      >
        Deploy agent
      </Button>
    </CenterAlignmentColumn>
  );
}
