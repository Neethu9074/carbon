import React from 'react/addons';

import ComboBox from 'in-components/ComboBox';

import './ZoneSorterControl.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-zone-sorter';

const ZoneSorterControl = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    onSortingSelected: rpt.func.isRequired
  },

  render() {
    return (
      <div className={block}>
        <span className={block + '__label'}>
          Sort by
        </span>
        <ComboBox label='Sort by'
                  onChange={this.props.onSortingSelected}
                  defaultValue={'zone'}>
          {'zone'}
          {'health'}
        </ComboBox>
      </div>
    );
  }
});

export default ZoneSorterControl;
