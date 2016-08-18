import {sortedIndexBy} from 'lodash';


export default function createTooltipRenderer(config) {
  let highlightedMoment;
  let y1DataColumn;
  let y2DataColumn;
  let dataPointsExistingAtMoment;

  return {
    showTooltip,
    hideTooltip,
    repositionTooltip
  };

  function showTooltip(_highlightedMoment) {
    highlightedMoment = _highlightedMoment;

    y1DataColumn = lookForDataPoint('y1');
    y2DataColumn = config.y2 ? lookForDataPoint('y2') : null;

    if (!y1DataColumn && !y2DataColumn) {
      return;
    }

    if (y1DataColumn) {
      dataPointsExistingAtMoment = y1DataColumn.time;
    } else if (y2DataColumn) {
      dataPointsExistingAtMoment = y2DataColumn.time;
    }

    repositionTooltip();
  }


  function hideTooltip() {
    highlightedMoment = null;
    dataPointsExistingAtMoment = null;
    y1DataColumn = null;
    y2DataColumn = null;
    config.dom.tooltipLine.style.display = 'none';
  }


  function repositionTooltip() {
    const time = dataPointsExistingAtMoment != null ? dataPointsExistingAtMoment : highlightedMoment;
    if (time == null) {
      return;
    }

    const x = config.scales.x.getRange(time);
    config.dom.tooltipLine.style.display = 'block';
    config.dom.tooltipLine.style.left = `${x}px`;
  }


  function lookForDataPoint(axisName) {
    const data = config.dataHolders[axisName].getDataColumns();
    const i = sortedIndexBy(
      data,
      highlightedMoment,
      column => {
        if (column.time) {
          return column.time;
        }
        // this iteratee function will be called for the search value as well
        return column;
      }
    );
    return data[i];
  }
}
