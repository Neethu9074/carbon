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
        <DescriptionItem title='Process ID'>
          {data.get('pid')}
        </DescriptionItem>
        <DescriptionItem title='Runtime Arguments'>
          {data.get('execArgs').join(' ')}
        </DescriptionItem>
        <DescriptionItem title='Runtime Versions'>
          {this.formatVersionInformation(data.get('versions'))}
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
