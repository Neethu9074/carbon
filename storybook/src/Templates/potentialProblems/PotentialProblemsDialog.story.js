/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PotentialProblemsDialogPresenter from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemsDialogPresenter';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { potentialProblemsCluster, alertRules as clusterAlertRules } from './potentialProblemsStorySharedData';
import { close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';

export default {
  title: 'Templates|potentialProblems/PotentialProblemsDialogPresenter',
  component: PotentialProblemsDialogPresenter
};

const props = {
  name: 'Payment',
  type: 'Service',
  applicationLabel: 'All Services',
  serviceLabel: 'acceptor',
  endpointLabel: 'POST /metrics',
  applicationId: '98234iuhsqitrb8xn',
  applications: {
    '98234iuhsqitrb8xn': {
      applicationId: '98234iuhsqitrb8xn'
    }
  },
  boundaryScope: 'INBOUND',
  tagFilters: [
    {
      name: 'application.id',
      operator: 'EQUALS',
      stringValue: 'applicationId'
    },
    {
      name: 'service.id',
      operator: 'EQUALS',
      stringValue: undefined
    },
    {
      name: 'endpoint.id',
      operator: 'EQUALS',
      stringValue: undefined
    }
  ],
  // eslint-disable-next-line react/display-name
  renderSmartAlertDialogComponent: dialogProps => {
    const { applicationLabel, serviceLabel, endpointLabel } = props;
    const tagFilters = [];

    if (serviceLabel) {
      tagFilters.push({
        name: 'service.name',
        operator: 'EQUALS',
        stringValue: serviceLabel
      });
    }

    if (endpointLabel) {
      tagFilters.push({
        name: 'endpoint.name',
        operator: 'EQUALS',
        stringValue: endpointLabel
      });
    }

    return (
      <SmartAlertConfigDialogWrapper
        applicationLabel={applicationLabel}
        formData={{
          ...props,
          ...dialogProps,
          tagFilters
        }}
        onClose={close}
      />
    );
  }
};

export const PotentialProblemsSingleItemDialog = () => {
  return (
    <>
      <PotentialProblemsDialogPresenter
        {...props}
        alertRules={alertRules}
        alerts={potentialProblemsSingle.alerts}
        thresholds={potentialProblemsSingle.thresholds}
      />
      <DialogPresenter />
    </>
  );
};

export const PotentialProblemsClusterDialog = () => {
  return (
    <>
      <PotentialProblemsDialogPresenter
        {...props}
        alertRules={clusterAlertRules}
        alerts={potentialProblemsCluster.alerts}
        thresholds={potentialProblemsCluster.thresholds}
      />
      <DialogPresenter />
    </>
  );
};

const alertRules = {
  throughput: {
    rule: {
      alertType: 'throughput',
      metricName: 'calls'
    }
  }
};

const potentialProblemsSingle = {
  thresholds: {
    throughput: {
      type: 'historicBaseline',
      lastUpdated: 1599052440000,
      operator: '>',
      seasonality: 'DAILY',
      baseline: [
        [1599048840000, 3821, 0.4693],
        [1599048900000, 3914, 0.0002],
        [1599048960000, 2351, 0.6878],
        [1599049020000, 664, 0.1542],
        [1599049080000, 4132, 0.1615],
        [1599049140000, 610, 0.9695],
        [1599049200000, 2086, 0.9109],
        [1599049260000, 1086, 0.9215],
        [1599049320000, 4255, 0.2166],
        [1599049380000, 4512, 0.8464],
        [1599049440000, 856, 0.1192],
        [1599049500000, 3839, 0.6328],
        [1599049560000, 4332, 0.7078],
        [1599049620000, 3429, 0.873],
        [1599049680000, 3761, 0.5952],
        [1599049740000, 1096, 0.0725],
        [1599049800000, 4269, 0.8331],
        [1599049860000, 2347, 0.0725],
        [1599049920000, 3598, 0.7833],
        [1599049980000, 2032, 0.635],
        [1599050040000, 4881, 0.8564],
        [1599050100000, 691, 0.1313],
        [1599050160000, 967, 0.8247],
        [1599050220000, 3441, 0.7228],
        [1599050280000, 4171, 0.6814],
        [1599050340000, 1786, 0.4872],
        [1599050400000, 1423, 0.8072],
        [1599050460000, 2457, 0.7472],
        [1599050520000, 4609, 0.7665],
        [1599050580000, 3234, 0.4401],
        [1599050640000, 4545, 0.0268],
        [1599050700000, 2560, 0.455],
        [1599050760000, 1527, 0.4879],
        [1599050820000, 3792, 0.1897],
        [1599050880000, 2957, 0.2105],
        [1599050940000, 4298, 0.2652],
        [1599051000000, 3368, 0.3701],
        [1599051060000, 1692, 0.821],
        [1599051120000, 2965, 0.2946],
        [1599051180000, 568, 0.9954],
        [1599051240000, 3847, 0.3543],
        [1599051300000, 1525, 0.0076],
        [1599051360000, 1009, 0.2878],
        [1599051420000, 2764, 0.4288],
        [1599051480000, 3379, 0.3533],
        [1599051540000, 4703, 0.2805],
        [1599051600000, 4375, 0.7641],
        [1599051660000, 2691, 0.8921],
        [1599051720000, 4292, 0.2471],
        [1599051780000, 3479, 0.0634],
        [1599051840000, 3545, 0.1438],
        [1599051900000, 3062, 0.6052],
        [1599051960000, 1822, 0.5595],
        [1599052020000, 4423, 0.8427],
        [1599052080000, 1397, 0.6384],
        [1599052140000, 3937, 0.4038],
        [1599052200000, 3988, 0.7893],
        [1599052260000, 3780, 0.1165],
        [1599052320000, 2122, 0.2981],
        [1599052380000, 1845, 0.3342]
      ],
      deviationFactor: 0.7147312994905671
    }
  },
  alerts: [
    {
      key: 'throughput',
      start: 1599049200395,
      end: 1599049245336
    }
  ]
};
