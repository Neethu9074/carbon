/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  timeWindowIncludesFirstCollectionTimestamp,
  renderMissingDataIndicator
} from 'in-service-levels/components/SloDashboard/components/chart/renderer/missingDataIndicator';
import { RenderWithMissingDataIndicatorProps } from 'in-service-levels/components/SloDashboard/components/chart/renderer/lineWithMissingDataIndicator';
import { Renderer } from 'in-components/Chart/renderer/types';
import renderer from 'in-components/Chart/renderer/Renderer';

function createBarWithMissingDataIndicatorRenderer({
  firstCollectedMetricTimestamp = 0
}: RenderWithMissingDataIndicatorProps): Renderer {
  return {
    id: 'barWithMissingDataIndicator',
    render: ({ config, axis }: any) => {
      // const filtered = Array.from(config.filteredDataSeries).map(item => parseInt(item.split('-')[1]));
      // function getLastNumber(str: string): number {
      //   const parts = str.split('-'); // Split the string by '-'
      //   return parseInt(parts[parts.length - 1], 10 || 0); // Get the last part and convert it to a number
      // }
      // console.log('config.filteredDataSerieslastNumbers', config.userFilteredDataSeries);
      // Iterate over the Set and extract the last number from each string
      // const lastNumbers: number[] = Array.from<string>(config.filteredDataSeries).map(getLastNumber);

      // Log the result
      // console.log('lastNumbers', lastNumbers); // Output: [1, 3, 10]

      // function removeIndices(metrics: any[], indices: any[]) {
      //   // Sort the indices in descending order to handle shifting issues
      //   // indices.sort((a: number, b: number) => b - a);
      //   console.log('indices', indices);
      //   // Remove each specified index
      //   indices.forEach((index: number) => {
      //     if (index >= 0 && index < metrics.length) {
      //       metrics.splice(index, 1);
      //     }
      //   });
      //   console.log('indicesssss', indices);
      //   console.log('indicesssssME', metrics);

      //   return metrics;
      // }
      // console.log('axis.metrics', axis.metrics);
      // const l = removeIndices(axis.metrics, lastNumbers);
      // console.log('LOTTT', l);
      renderer.bar.render({
        metrics: axis.metrics,
        colors100: config.y1.colors,
        scale: config.scales.y1,
        config,
        axis: { dynamicCalculatedBlockSizeMillis: config.granularity, ...axis }
      } as any);

      if (timeWindowIncludesFirstCollectionTimestamp(firstCollectedMetricTimestamp, config.timeConfig)) {
        renderMissingDataIndicator(config, firstCollectedMetricTimestamp);
      }
    }
  };
}
export function useBarWithMissingDataIndicatorRenderer(props: RenderWithMissingDataIndicatorProps) {
  return createBarWithMissingDataIndicatorRenderer(props);
}

export default createBarWithMissingDataIndicatorRenderer({});
