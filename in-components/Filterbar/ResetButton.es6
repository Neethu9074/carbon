import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Icon from '../Icon';

import './ResetButton.less';

const block = 'in-sidebar-resetButton';

const ResetButton = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <div className={block}
           onClick={this.props.onClick}>
        {'Reset'}
        <Icon className={block + '__icon'} type='reset' />
      </div>
    );
  }
});

export default ResetButton;
