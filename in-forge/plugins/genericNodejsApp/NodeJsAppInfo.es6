import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const NodeJsInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Name'>
          {data.get('name')}
        </DescriptionItem>
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title='Description'>
          {data.get('description')}
        </DescriptionItem>
        <DescriptionItem title='Arguments'>
          {data.get('args').join(' ')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default NodeJsInfo;
