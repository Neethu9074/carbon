/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Card } from '@instana/components';

import { WidgetHeader } from 'in-custom-dashboards/widgets/Slo/WidgetHeader';
import SliConfigInfo from 'in-custom-dashboards/widgets/Slo/SliConfigInfo';
import Chart from 'in-custom-dashboards/widgets/Slo/Chart';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

import showCaseLocals from './ShowCase.mless';
import locals from './Widget.mless';

export default function ShowCase() {
  const result = success([
    {
      id: 'consumed',
      values: [
        [1625033580000, 0],
        [1625033640000, 117],
        [1625033700000, 224],
        [1625033760000, 335],
        [1625033820000, 457],
        [1625033880000, 562],
        [1625033940000, 677],
        [1625034000000, 807],
        [1625034060000, 940],
        [1625034120000, 1056],
        [1625034180000, 1179],
        [1625034240000, 1292],
        [1625034300000, 1422],
        [1625034360000, 1550],
        [1625034420000, 1682],
        [1625034480000, 1799],
        [1625034540000, 1927],
        [1625034600000, 2050],
        [1625034660000, 2174],
        [1625034720000, 2301],
        [1625034780000, 2454],
        [1625034840000, 2614],
        [1625034900000, 2754],
        [1625034960000, 2897],
        [1625035020000, 3016],
        [1625035080000, 3128],
        [1625035140000, 3248],
        [1625035200000, 3351],
        [1625035260000, 3473],
        [1625035320000, 3599],
        [1625035380000, 3707],
        [1625035440000, 3827],
        [1625035500000, 3941],
        [1625035560000, 4050],
        [1625035620000, 4165],
        [1625035680000, 4287],
        [1625035740000, 4401],
        [1625035800000, 4509],
        [1625035860000, 4625],
        [1625035920000, 4741],
        [1625035980000, 4856],
        [1625036040000, 4976],
        [1625036100000, 5082],
        [1625036160000, 5201],
        [1625036220000, 5327],
        [1625036280000, 5448],
        [1625036340000, 5563],
        [1625036400000, 5676],
        [1625036460000, 5813],
        [1625036520000, 5941],
        [1625036580000, 6065],
        [1625036640000, 6143],
        [1625036700000, 6254],
        [1625036760000, 6367],
        [1625036820000, 6480],
        [1625036880000, 6597],
        [1625036940000, 6717],
        [1625037000000, 6843],
        [1625037060000, 6961],
        [1625037120000, 7088],
        [1625037180000, 7088]
      ]
    },
    { id: 'sli', values: [[1625037184996, 0.997]] },
    { id: 'spent', values: [[1625037184996, 7088]] },
    { id: 'remaining', values: [[1625037184996, 233348]] },
    { id: 'budget', values: [[1625037184996, 240436]] },
    {
      id: 'hourlyBudget',
      values: [
        [1625033580000, 0],
        [1625033640000, 4125],
        [1625033700000, 8263],
        [1625033760000, 12400],
        [1625033820000, 16535],
        [1625033880000, 20668],
        [1625033940000, 24809],
        [1625034000000, 28954],
        [1625034060000, 33147],
        [1625034120000, 37281],
        [1625034180000, 41422],
        [1625034240000, 45563],
        [1625034300000, 49697],
        [1625034360000, 53855],
        [1625034420000, 58032],
        [1625034480000, 62179],
        [1625034540000, 66325],
        [1625034600000, 70344],
        [1625034660000, 74345],
        [1625034720000, 78383],
        [1625034780000, 82439],
        [1625034840000, 86495],
        [1625034900000, 90695],
        [1625034960000, 94839],
        [1625035020000, 98966],
        [1625035080000, 103095],
        [1625035140000, 107227],
        [1625035200000, 111377],
        [1625035260000, 115536],
        [1625035320000, 119695],
        [1625035380000, 123855],
        [1625035440000, 127985],
        [1625035500000, 132137],
        [1625035560000, 136282],
        [1625035620000, 140374],
        [1625035680000, 144516],
        [1625035740000, 148661],
        [1625035800000, 152804],
        [1625035860000, 156962],
        [1625035920000, 161048],
        [1625035980000, 165176],
        [1625036040000, 169319],
        [1625036100000, 173466],
        [1625036160000, 177612],
        [1625036220000, 181749],
        [1625036280000, 185887],
        [1625036340000, 190045],
        [1625036400000, 194256],
        [1625036460000, 198289],
        [1625036520000, 200541],
        [1625036580000, 204649],
        [1625036640000, 207980],
        [1625036700000, 211647],
        [1625036760000, 215708],
        [1625036820000, 219852],
        [1625036880000, 223987],
        [1625036940000, 228151],
        [1625037000000, 232280],
        [1625037060000, 236454],
        [1625037120000, 240435],
        [1625037180000, 240435]
      ]
    }
  ]);

  const sliConfig = {
    id: '1',
    sliName: 'grafanatest',
    initialEvaluationTimestamp: 1608719460000,
    metricConfiguration: null,
    sliEntity: {
      sliType: 'availability',
      applicationId: null,
      serviceId: null,
      endpointId: null,
      boundaryScope: 'INBOUND',
      goodEventFilters: null,
      badEventFilters: null,
      includeInternal: false,
      includeSynthetic: false,
      goodEventFilterExpression: {
        type: 'TAG_FILTER',
        name: 'call.erroneous',
        stringValue: null,
        numberValue: null,
        booleanValue: false,
        key: null,
        value: false,
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE'
      },
      badEventFilterExpression: {
        type: 'TAG_FILTER',
        name: 'call.erroneous',
        stringValue: null,
        numberValue: null,
        booleanValue: true,
        key: null,
        value: true,
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE'
      }
    },
    lastUpdated: 1608719447835
  };

  const budget = 240436;

  const fromTimestamp = 1625034006696;
  const timeWindowConfig = { to: 1625037606696, windowSize: 3600000, focusedMoment: 1625037606696, autoRefresh: false };
  const toTimestamp = 1625037606696;

  return (
    <div className={showCaseLocals.wrapper}>
      <Card
        bodyClassName={locals.bodyNoPadding}
        title={t('in-custom-dashboards:widgets.slo.demo.title')}
        headerClassName={locals.title}
        leftHeaderContent={
          <>
            <span className={locals.apName}>{t('in-custom-dashboards:widgets.slo.demo.appName')}</span>
            <SliConfigInfo sliConfig={sliConfig} />
          </>
        }
      >
        <WidgetHeader
          slo=""
          budget={budget}
          isDynamic={false}
          isRolling
          fromTimestamp={fromTimestamp}
          toTimestamp={toTimestamp}
          result={result}
          sliEntity={sliConfig?.sliEntity}
        />
        <div className={locals.chart}>
          <WidgetContent
            result={result}
            sliConfigIdValue="1"
            timeConfig={timeWindowConfig}
            granularity={60000}
            budget={budget}
            sliConfig={sliConfig}
            isPreview
            disableZooming
          />
        </div>
      </Card>
    </div>
  );
}

export const findResultMetric = (result, id) => {
  return (result?.data ?? []).find(dataSeries => dataSeries.id === id)?.values;
};

const filterAvailableData = dataSeries => {
  if (!dataSeries) {
    return [];
  }

  // when no data for a specific metric was returned
  if (dataSeries.length === 1) {
    if (dataSeries[0][0] == null) {
      return [];
    }
  }
  // Filtering-out the values with timestamps in future
  // This should be done on the backend normally, but it was not specified, hence it was
  // implemented on the client in time.
  const now = new Date().getTime();
  return dataSeries.filter(([ts]) => ts <= now);
};

const WidgetContent = ({ result, ...otherChartProps }) => {
  return (
    <Chart
      result={result}
      consumed={filterAvailableData(findResultMetric(result, 'consumed', result))}
      hourlyBudget={filterAvailableData(findResultMetric(result, 'hourlyBudget', result))}
      {...otherChartProps}
    />
  );
};
