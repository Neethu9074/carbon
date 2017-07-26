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

    y1DataColumn = lookForDataPoint('y1', highlightedMoment);

    if (y1DataColumn) {
      dataPointsExistingAtMoment = y1DataColumn.time;
    }

    y2DataColumn = config.y2 ? lookForDataPoint('y2', dataPointsExistingAtMoment || highlightedMoment) : null;

    if (!y1DataColumn && !y2DataColumn) {
      dataPointsAvailable = false;
    }

    if (y1DataColumn && y2DataColumn && y2DataColumn.time !== dataPointsExistingAtMoment) {
      y2DataColumn = null;
    } else if (!y1DataColumn && y2DataColumn) {
      dataPointsExistingAtMoment = y2DataColumn.time;
    } else if (!y1DataColumn && !y2DataColumn) {
      hideTooltip();
      return;
    }

    const rollupInMillis = config.rollup.rollup || 1000;
    // it makes no sense to show a tooltip for a time that is too far off the desired time.
    if (Math.abs(dataPointsExistingAtMoment - highlightedMoment) > rollupInMillis * 2.3) {
      hideTooltip();
      return;
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

    const x = config.scales.x.getRange(time);
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

  function lookForDataPoint(axisName, searchFor) {
    const data = config.dataHolders[axisName].getDataColumns();
    const i = sortedIndexBy(data, searchFor, column => {
      if (column.time) {
        return column.time;
      }
      // this iteratee function will be called for the search value as well
      return column;
    });

    const prev = data[i - 1];
    const current = data[i];
    if (!prev) {
      return current;
    }
    if (Math.abs(current.time - searchFor) < Math.abs(prev.time - searchFor)) {
      return current;
    }
    return prev;
  }
}
