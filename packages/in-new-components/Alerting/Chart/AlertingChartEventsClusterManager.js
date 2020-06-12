import { getPredefinedBlockSizeMillisForBlockSize, getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { onMove, onLeave, onEnter } from 'in-services/util/reactiveMouseEvents';
import { getSumOfAlertsPerCluster } from './ChartAlertUtils';
import { minPixelsPerBlock } from './renderer/alertMarkers';
import { isSafari } from 'in-services/browser';

export default class AlertingChartEventsClusterManager {
  constructor(canvas, { scales, timeConfig, granularity, frontBufferCanvas }, requestRender) {
    this.canvas = canvas;
    this.hideHighlight = false;
    this.isSafari = isSafari();

    this.mouseMoveSubscription = onMove(
      canvas,
      this.onMouseMove(frontBufferCanvas, scales, timeConfig, granularity, requestRender)
    );

    this.mouseLeaveSubscription = onLeave(canvas, () => {
      this.hideHighlight = true;
      requestRender();
    });

    this.mouseLeaveSubscription = onEnter(canvas, () => {
      this.hideHighlight = false;
      requestRender();
    });
  }

  onMouseMove(frontBufferCanvas, scales, timeConfig, granularity, requestRender) {
    return event => {
      const { clientX } = event;
      const { left } = frontBufferCanvas.getBoundingClientRect();
      const xPos = clientX - left;
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
      this.clusterWidthPixels = xScale.getRangeArea(clusterWidthMillis);
      this.indexClusterToHighlight = Math.floor(xPos / this.clusterWidthPixels);
      requestRender();
    };
  }

  dispose() {
    this.mouseMoveSubscription.dispose();
    this.mouseMoveSubscription = null;
    this.mouseLeaveSubscription.dispose();
    this.mouseLeaveSubscription = null;
  }

  render(alertEvents, config) {
    const {
      backBufferCtx,
      markerPaneHeight,
      scales: { y1, xBackBuffer }
    } = config;

    const chartHeight = y1.getRangeFrom();
    const rectX = this.indexClusterToHighlight * this.clusterWidthPixels;
    const rectY = markerPaneHeight;
    const rectWidth = this.clusterWidthPixels;
    const rectHeight = chartHeight - markerPaneHeight;
    const alertEventsPerCluster = getSumOfAlertsPerCluster({
      index: this.indexClusterToHighlight,
      xBackBuffer,
      alertEvents,
      clusterWidthPixels: this.clusterWidthPixels
    });

    if (alertEventsPerCluster > 0) {
      this.drawHighlightRect(backBufferCtx, rectX, rectY, rectWidth, rectHeight);
      this.drawTooltip({ backBufferCtx, xBackBuffer, alertEventsPerCluster, xPos: rectX, yPos: rectY });
    }
  }

  drawHighlightRect(backBufferCtx, rectX, rectY, rectWidth, rectHeight) {
    backBufferCtx.save();
    backBufferCtx.fillStyle = this.hideHighlight ? 'transparent' : 'rgba(99, 114, 130, 0.3)';
    backBufferCtx.fillRect(rectX, rectY, rectWidth, rectHeight);
    backBufferCtx.restore();
  }

  drawTooltip({ backBufferCtx, xBackBuffer, alertEventsPerCluster, xPos, yPos }) {
    backBufferCtx.save();
    // Safari doesn't render REM correctly, so Safari users won't be able to scale the tooltip.
    backBufferCtx.font = `${this.isSafari ? '12px' : '.75rem'} sans-serif`;

    const chartWidth = xBackBuffer.getRangeTo();
    const padding = 8;
    const text = `${alertEventsPerCluster} Alerts`;
    const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = backBufferCtx.measureText(text);
    const middleOfClusterByIndex = this.indexClusterToHighlight * this.clusterWidthPixels + this.clusterWidthPixels / 2;

    if (middleOfClusterByIndex > chartWidth / 2) {
      xPos = middleOfClusterByIndex - width - 2 * padding;
    } else {
      xPos = middleOfClusterByIndex;
    }
    yPos = 1.5 * yPos;

    backBufferCtx.fillStyle = this.hideHighlight ? 'transparent' : '#000';
    backBufferCtx.globalAlpha = 0.75;
    backBufferCtx.fillRect(
      xPos,
      yPos - actualBoundingBoxAscent - actualBoundingBoxDescent,
      width + 2 * padding,
      actualBoundingBoxAscent - actualBoundingBoxDescent + 2 * padding
    );

    backBufferCtx.globalAlpha = 1;
    backBufferCtx.fillStyle = this.hideHighlight ? 'transparent' : '#fff';
    backBufferCtx.fillText(text, xPos + padding, yPos + padding);

    backBufferCtx.restore();
  }
}
