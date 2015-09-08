

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const MongoDBInfo = React.createClass({
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
        <DescriptionItem title='Port'>
          {data.get('port')}
        </DescriptionItem>
        <DescriptionItem title='Databases'>
          {data.get('databases', []).join(', ')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default MongoDBInfo;
