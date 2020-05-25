import theme from 'in-themes';

import { getPredefinedBlockSizeMillisForBlockSize, getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { getSumOfAlertsPerCluster } from 'in-new-components/Alerting/Chart/ChartAlertUtils';

let path = null;
let pathMoreThanOneAlert = null;

const alertIndicator16 =
  'M13.4317946,11.9821449 L8.56512795,3.31547821 C8.44356843,3.11933359 8.22921966,3 7.99846128,3 C7.7677029,3 7.55335413,3.11933359 7.43179461,3.31547821 L2.56512795,11.9821449 C2.44926364,12.1817066 2.44483931,12.4269949 2.55343149,12.6306052 C2.66202366,12.8342155 2.86818802,12.9671898 3.09846128,12.9821449 L12.8317946,12.9821449 C13.0740022,12.9904611 13.301645,12.8666817 13.4263332,12.658868 C13.5510213,12.4510543 13.5531125,12.1919439 13.4317946,11.9821449 Z M10.787023,10.9819478 L5.11019192,10.9819478 L7.94860745,5.97321731 L10.787023,10.9819478 Z';

const alertIndicator16MoreThanOneAlert =
  'M6.99846128,3 C7.19625417,3 7.38199103,3.08767366 7.50757272,3.23624292 L7.56512795,3.31547821 L12.4317946,11.9821449 C12.5531125,12.1919439 12.5510213,12.4510543 12.4263332,12.658868 C12.3194576,12.836994 12.1369419,12.9533806 11.9344484,12.9777616 L11.8317946,12.9821449 L2.09846128,12.9821449 C1.86818802,12.9671898 1.66202366,12.8342155 1.55343149,12.6306052 C1.46293801,12.4609299 1.45092821,12.2623117 1.51648976,12.0853316 L1.56512795,11.9821449 L6.43179461,3.31547821 C6.55335413,3.11933359 6.7677029,3 6.99846128,3 Z M6.94860745,5.97321731 L4.11019192,10.9819478 L9.78702297,10.9819478 L6.94860745,5.97321731 Z M11.5,1 C11.9142136,1 12.25,1.33578644 12.25,1.75 L12.2496273,3.249 L13.75,3.25 C14.1642136,3.25 14.5,3.58578644 14.5,4 C14.5,4.41421356 14.1642136,4.75 13.75,4.75 L12.2496273,4.749 L12.25,6.25 C12.25,6.66421356 11.9142136,7 11.5,7 C11.0857864,7 10.75,6.66421356 10.75,6.25 L10.7496273,4.749 L9.51762732,4.749 L8.77162732,3.42234136 C8.90146001,3.31470341 9.06817386,3.25 9.25,3.25 L10.7496273,3.249 L10.75,1.75 C10.75,1.33578644 11.0857864,1 11.5,1 Z';

const iconSize = 16;

export const minPixelsPerBlock = iconSize + 8;

export default {
  render: (alertEvents, { scales, backBufferCtx, timeConfig, granularity }) => {
    if (!alertEvents || alertEvents.length === 0) {
      return;
    }

    if (!path) {
      path = new Path2D(alertIndicator16);
    }

    if (!pathMoreThanOneAlert) {
      pathMoreThanOneAlert = new Path2D(alertIndicator16MoreThanOneAlert);
    }

    const xScale = scales.xBackBuffer;
    const chartWidth = xScale.getRangeTo();
    const clusterWidthMillis = getPredefinedBlockSizeMillisForBlockSize(
      getBlockSizeMillis({
        windowSize: timeConfig.windowSize,
        minPixelsPerBlock,
        width: chartWidth,
        rollup: granularity
      })
    );
    const clusterWidthPixels = xScale.getRangeArea(clusterWidthMillis);
    const numberOfClusters = Math.trunc(chartWidth / clusterWidthPixels);

    backBufferCtx.save();
    backBufferCtx.fillStyle = theme.lib.colors.red800;
    backBufferCtx.translate(0, 6);

    for (let i = 0; i <= numberOfClusters; i++) {
      const xPos = i * clusterWidthPixels + (clusterWidthPixels / 2 - iconSize / 2);
      const sumAlertPerCluster = getSumOfAlertsPerCluster({
        index: i,
        clusterWidthPixels,
        xBackBuffer: xScale,
        alertEvents
      });

      backBufferCtx.translate(xPos, 0);

      if (sumAlertPerCluster > 0) {
        backBufferCtx.fill(sumAlertPerCluster > 1 ? pathMoreThanOneAlert : path);
      }
      backBufferCtx.translate(-xPos, 0);
    }

    backBufferCtx.restore();
  }
};
