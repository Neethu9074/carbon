/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { TimeConfig, Application, SliConfigurationWithLastUpdated } from '@instana/types';

import Widget from 'in-custom-dashboards/widgets/SloLegacy/components/widget/Widget';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { t } from 'in-i18n';

import locals from './ShowCase.mless';

export default function ShowCase() {
  const dataSeries = [
    {
      id: 'consumed',
      values: [
        [1625033610000, 0],
        [1625033670000, 117],
        [1625033730000, 224],
        [1625033790000, 335],
        [1625033850000, 457],
        [1625033910000, 562],
        [1625033970000, 677],
        [1625034030000, 807],
        [1625034090000, 940],
        [1625034150000, 1056],
        [1625034210000, 1179],
        [1625034270000, 1292],
        [1625034330000, 1422],
        [1625034390000, 1550],
        [1625034450000, 1682],
        [1625034510000, 1799],
        [1625034570000, 1927],
        [1625034630000, 2050],
        [1625034690000, 2174],
        [1625034750000, 2301],
        [1625034810000, 2454],
        [1625034870000, 2614],
        [1625034930000, 2754],
        [1625034990000, 2897],
        [1625035050000, 3016],
        [1625035110000, 3128],
        [1625035170000, 3248],
        [1625035230000, 3351],
        [1625035290000, 3473],
        [1625035350000, 3599],
        [1625035410000, 3707],
        [1625035470000, 3827],
        [1625035530000, 3941],
        [1625035590000, 4050],
        [1625035650000, 4165],
        [1625035710000, 4287],
        [1625035770000, 4401],
        [1625035830000, 4509],
        [1625035890000, 4625],
        [1625035950000, 4741],
        [1625036010000, 4856],
        [1625036070000, 4976],
        [1625036130000, 5082],
        [1625036190000, 5201],
        [1625036250000, 5327],
        [1625036310000, 5448],
        [1625036370000, 5563],
        [1625036430000, 5676],
        [1625036490000, 5813],
        [1625036550000, 5941],
        [1625036610000, 6065],
        [1625036670000, 6143],
        [1625036730000, 6254],
        [1625036790000, 6367],
        [1625036850000, 6480],
        [1625036910000, 6597],
        [1625036970000, 6717],
        [1625037030000, 6843],
        [1625037090000, 6961],
        [1625037150000, 7088]
      ]
    },
    { id: 'sli', values: [[1625037184996, 0.997]] },
    { id: 'spent', values: [[1625037184996, 7088]] },
    { id: 'remaining', values: [[1625037184996, 233348]] },
    { id: 'budget', values: [[1625037184996, 240436]] },
    {
      id: 'hourlyBudget',
      values: [
        [1625033610000, 0],
        [1625033670000, 4125],
        [1625033730000, 8263],
        [1625033790000, 12400],
        [1625033850000, 16535],
        [1625033910000, 20668],
        [1625033970000, 24809],
        [1625034030000, 28954],
        [1625034090000, 33147],
        [1625034150000, 37281],
        [1625034210000, 41422],
        [1625034270000, 45563],
        [1625034330000, 49697],
        [1625034390000, 53855],
        [1625034450000, 58032],
        [1625034510000, 62179],
        [1625034570000, 66325],
        [1625034630000, 70344],
        [1625034690000, 74345],
        [1625034750000, 78383],
        [1625034810000, 82439],
        [1625034870000, 86495],
        [1625034930000, 90695],
        [1625034990000, 94839],
        [1625035050000, 98966],
        [1625035110000, 103095],
        [1625035170000, 107227],
        [1625035230000, 111377],
        [1625035290000, 115536],
        [1625035350000, 119695],
        [1625035410000, 123855],
        [1625035470000, 127985],
        [1625035530000, 132137],
        [1625035590000, 136282],
        [1625035650000, 140374],
        [1625035710000, 144516],
        [1625035770000, 148661],
        [1625035830000, 152804],
        [1625035890000, 156962],
        [1625035950000, 161048],
        [1625036010000, 165176],
        [1625036070000, 169319],
        [1625036130000, 173466],
        [1625036190000, 177612],
        [1625036250000, 181749],
        [1625036310000, 185887],
        [1625036370000, 190045],
        [1625036430000, 194256],
        [1625036490000, 198289],
        [1625036550000, 200541],
        [1625036610000, 204649],
        [1625036670000, 207980],
        [1625036730000, 211647],
        [1625036790000, 215708],
        [1625036850000, 219852],
        [1625036910000, 223987],
        [1625036970000, 228151],
        [1625037030000, 232280],
        [1625037090000, 236454],
        [1625037150000, 240435]
      ]
    }
  ];

  const sliConfig: SliConfigurationWithLastUpdated = {
    id: '1',
    sliName: t('in-custom-dashboards:widgets.slo.demo.sliName'),
    initialEvaluationTimestamp: 1608719460000,
    sliEntity: {
      sliType: 'availability',
      boundaryScope: 'INBOUND',
      includeInternal: false,
      includeSynthetic: false,
      goodEventFilterExpression: tagFilter('call.erroneous', 'EQUALS', false),
      badEventFilterExpression: tagFilter('call.erroneous', 'EQUALS', true)
    },
    lastUpdated: 1
  };
  const application: Application = {
    boundaryScope: 'INBOUND',
    id: 'exampleAP',
    label: t('in-custom-dashboards:widgets.slo.demo.appName')
  };

  const slo = 0.9999;
  const granularity = 60000;

  const fromTimestamp = 1625033580000;
  const timeConfig: TimeConfig = {
    to: 1625037180000,
    windowSize: 3600000,
    focusedMoment: 1625037606696,
    autoRefresh: false
  };
  const toTimestamp = 1625037180000;

  return (
    <div className={locals.wrapper}>
      <Widget
        title={t('in-custom-dashboards:widgets.slo.demo.title')}
        entityType="application"
        entity={application}
        sliConfiguration={sliConfig}
        slo={slo}
        sloMetrics={dataSeries}
        granularity={granularity}
        timeWindowType="rolling"
        timeWindowConfig={{ timeConfig, fromTimestamp, toTimestamp }}
        status="resolved"
        progress={{ loading: false }}
        errors={[]}
        disableZooming
        nonInteractive
      />
    </div>
  );
}
