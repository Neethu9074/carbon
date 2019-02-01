import React from 'react';

import createSensitivityDefaultChartController from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/sensitivityDefaultChartController';
import getElementDimensions from 'in-hoc/getElementDimensions';

import './SensitivityDefaultChart.less';

const block = 'in-dynamic-rule-dialog-sensitivity-default-chart';

export default getElementDimensions(
  class extends React.PureComponent {
    static displayName = 'SensitivityDefaultChart';

    componentDidMount() {
      this.controller = createSensitivityDefaultChartController(this.canvas);
    }

    componentWillUpdate(nextProps) {
      this.controller.update(nextProps.sensitivity, nextProps.width, nextProps.height);
    }

    render() {
      return (
        <div className={block}>
          <canvas ref={canvas => (this.canvas = canvas)} className={`${block}__canvas`} />
          <div className={`${block}__notification`}>not based on real data</div>
        </div>
      );
    }
  }
);
