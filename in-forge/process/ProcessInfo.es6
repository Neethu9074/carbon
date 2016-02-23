import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const ProcessInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    return (
      <DescriptionList>
        <DescriptionItem title='Process ID'>
          {data.get('pid')}
        </DescriptionItem>
        <DescriptionItem title='Executable'>
          {data.get('exec')}
        </DescriptionItem>
        <DescriptionItem title='User'>
          {data.get('user')}
        </DescriptionItem>
        <DescriptionItem title='Group'>
          {data.get('group')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default ProcessInfo;
