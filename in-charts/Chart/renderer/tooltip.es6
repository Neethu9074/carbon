import { sortedIndexBy } from 'lodash';
import ReactDOM from 'react-dom';
import React from 'react';

import ReactTooltip from 'in-charts/Chart/renderer/ReactTooltip';
import { applyTransform } from 'in-services/util/dom';

export default function createTooltipRenderer(config) {
  let highlightedMoment;
  let y1DataColumn;
  let y2DataColumn;
  let dataPointsExistingAtMoment;
  let dataPointsAvailable;

  hideTooltip();

  return {
    showTooltip,
    hideTooltip,
    repositionTooltip,
    dispose
  };

  function dispose() {
    ReactDOM.unmountComponentAtNode(config.dom.tooltipContainer);
  }

  function showTooltip(_highlightedMoment) {
    dataPointsExistingAtMoment = null;
    dataPointsAvailable = true;
    highlightedMoment = _highlightedMoment;

    if (!config.rollup) {
      return;
    }

    y1DataColumn = getDataPointIfInRange(lookForDataPoint('y1', highlightedMoment), highlightedMoment, config, 'y1');
    if (y1DataColumn) {
      dataPointsExistingAtMoment = y1DataColumn.time;
    }

    y2DataColumn = config.y2
      ? getDataPointIfInRange(
          lookForDataPoint('y2', dataPointsExistingAtMoment || highlightedMoment),
          highlightedMoment,
          config,
          'y2'
        )
      : null;

    if (!y1DataColumn && !y2DataColumn) {
      dataPointsAvailable = false;
      hideTooltip();
      return;
    }

    if (y1DataColumn && y2DataColumn && y2DataColumn.time !== dataPointsExistingAtMoment) {
      y2DataColumn = null;
    } else if (!y1DataColumn && y2DataColumn) {
      dataPointsExistingAtMoment = y2DataColumn.time;
    }

    repositionTooltip();

    ReactDOM.render(
      <ReactTooltip
        config={config}
        y1DataColumn={y1DataColumn}
        y2DataColumn={y2DataColumn}
        dataPointsAvailable={dataPointsAvailable}
        time={dataPointsExistingAtMoment}
      />,
      config.dom.tooltipContainer
    );
  }

  function hideTooltip() {
    highlightedMoment = null;
    dataPointsExistingAtMoment = null;
    y1DataColumn = null;
    y2DataColumn = null;
    config.dom.tooltipLine.style.display = 'none';
    config.dom.tooltipContainer.style.display = 'none';
  }

  function repositionTooltip() {
    const time = dataPointsExistingAtMoment != null ? dataPointsExistingAtMoment : highlightedMoment;
    if (time == null) {
      return;
    }

    let x;
    if (config.y1.isDynamicAggregated) {
      x = config.scales.x.getRange(time - config.y1.dynamicCalculatedBlockSizeMillis / 2);
    } else {
      x = config.scales.x.getRange(time);
    }

    if (x < config.scales.x.getRangeFrom()) {
      config.dom.tooltipLine.style.display = 'none';
      config.dom.tooltipContainer.style.display = 'none';
      return;
    }

    config.dom.tooltipLine.style.display = 'block';
    config.dom.tooltipContainer.style.display = 'block';

    applyTransform(config.dom.tooltipLine, `translateX(${x}px)`);

    if (x > config.width / 2) {
      const tooltipX = config.width - x + 30;
      config.dom.tooltipContainer.style.left = null;
      config.dom.tooltipContainer.style.right = `${tooltipX}px`;
    } else {
      config.dom.tooltipContainer.style.left = `${x + 30}px`;
      config.dom.tooltipContainer.style.right = null;
    }
  }

  function getDataPointIfInRange(dataPoint, highlightedMoment, config, axis) {
    if (!dataPoint) {
      return null;
    }

    let maxDistanceBetweenDataPoints = 2.3 * (config.rollup.rollup || 1000);
    if (config[axis] && config[axis].dynamicCalculatedBlockSizeMillis) {
      maxDistanceBetweenDataPoints = config[axis].dynamicCalculatedBlockSizeMillis;
    }
    return Math.abs(dataPoint.time - highlightedMoment) <= maxDistanceBetweenDataPoints ? dataPoint : null;
  }

  function lookForDataPoint(axisName, searchFor) {
    const data = config.dataHolders[axisName].getDataColumns();
    const i = sortedIndexBy(data, searchFor, column => {
      if (column.time) {
        return column.time;
      }
      // this iteratee function will be called for the search value as well
      return column;
    });

    const offset = config[axisName].isDynamicAggregated ? config[axisName].dynamicCalculatedBlockSizeMillis / 2 : 0;
    const prev = data[i - 1];
    const current = data[i];
    if (!prev) {
      return current;
    }
    if (!current) {
      return null;
    }
    if (Math.abs(current.time - offset - searchFor) < Math.abs(prev.time - offset - searchFor)) {
      return current;
    }
    return prev;
  }
}
