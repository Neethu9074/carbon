import React from 'react/addons';

import Icon from '../Icon';

import './ResetButton.less';

const block = 'in-sidebar-resetButton';

const ResetButton = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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
