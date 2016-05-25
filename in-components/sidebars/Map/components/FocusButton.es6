import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getClassName} from 'in-services/react';
import Icon from 'in-components/Icon';

import './FocusButton.less';


const block = 'in-sidebar-map__focus-icon';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'FocusButton',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    onClick: rpt.func.isRequired,
    className: rpt.string
  },

  render() {
    return (
      <Icon className={getClassName(this, block)}
            onClick={this.props.onClick}
            type={'relocate'}/>
    );
  }
});
