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
import { t } from 'in-i18n';

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
          {t('in-bizops:processes.noProcessesAvailable')}
          <br />
          {t('in-bizops:processes.deployAgentFirst')}
          <br />
          {t('in-bizops:processes.forMoreInformation')}{' '}
          <a href="https://www.ibm.com/docs/en/instana-observability/latest?topic=instana-business-monitoring">
            {t('in-bizops:processes.documentation')}
          </a>
        </p>
      </div>
      <Button
        kind="primary"
        href={href}
        className={locals.bizopsDeployAgent}
        onClick={() => bizopsDeployAgentClick(trackerProps)}
      >
        {t('in-bizops:processes.deployAgent')}
      </Button>
    </CenterAlignmentColumn>
  );
}
