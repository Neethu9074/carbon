import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const SpringbootInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default SpringbootInfo;
