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
        <DescriptionItem title='Dependencies'>
          {this.formatVersionInformation(data.get('dependencies'))}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  formatVersionInformation(versions) {
    if (!versions || versions.isEmpty()) {
      return null;
    }

    const versionNames = versions.keySeq().toArray();
    versionNames.sort();

    return (
      <div>
        {versionNames.map(name =>
          <div key={name}>
            {name}@{versions.get(name)}
          </div>
        )}
      </div>
    );
  }
});

export default NodeJsInfo;
