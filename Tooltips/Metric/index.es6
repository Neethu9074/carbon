'use strict';

import React from 'react/addons';
import Immutable from 'immutable';

import TooltipFrame from '../Frame';
import Heading from '../Heading';
import Content from '../Content';

import {theme} from 'instana-ui-services/theme';

import './index.less';


/*eslint-disable no-unused-vars*/
export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    metrics: React.PropTypes.any.isRequired,
    values: React.PropTypes.array.isRequired
  },

  render() {
    const metrics = this.props.metrics;
    const values = this.props.values;
    if(values.length === 0 || metrics.size === 0) {
      return null;
    }

    let colorIndex = 0;
    const colors = theme.chart.strokeColors;
    const listItems = values.map((value, index) => {
      const color = colors[colorIndex];
      colorIndex++;
      if(colorIndex >= colors.length) {
        colorIndex = 0;
      }
      const style = {color};
      const metricName = metrics.getIn([index, 'name']);
      const metricLabel = metrics.getIn([index, 'label']);

      return (
        <li key={metricName}>
          <div className='in-tooltip__metric-li--wrapper'>
            <Heading className={'in-tooltip__metric-li--name'} style={style}>
              {metricLabel}
            </Heading>
            <Content className='in-tooltip__metric-li--value'>
              {value}
            </Content>
          </div>
        </li>);
    });

    return (
      <TooltipFrame>
        <ul className='in-tooltip__metric-ul'>
          {listItems}
        </ul>
      </TooltipFrame>
    );
  }
});
/*eslint-enable no-unused-vars*/
