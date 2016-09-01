import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import 'in-components/Controls/components/Control.less';


const rpt = React.PropTypes;
const block = 'in-control';

export default React.createClass({

  displayName: 'Control',

  propTypes: {
    iconSize: rpt.number.isRequired,
    onClick: rpt.func.isRequired,
    type: rpt.string.isRequired,
    isToggle: rpt.bool
  },

  getInitialState() {
    return {
      isActive: false
    };
  },

  render() {
    const iconSize = this.props.iconSize;

    return (
      <div className={block}
           onClick={() => {
             this.props.onClick();
             if (this.props.isToggle) {
               this.setState({ isActive: !this.state.isActive });
             }
           }}>
        <SvgIcon type={this.props.type}
                 width={iconSize}
                 height={iconSize}
                 color={this.state.isActive ? '#9fffff' : '#7b8e96'} />
      </div>
    );
  }
});
