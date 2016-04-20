import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const JBossAsInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {data.get('serverInfo').get('releaseVersion')}
        </DescriptionItem>
        <DescriptionItem title='Home'>
          {data.get('serverInfo').get('homeDir')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default JBossAsInfo;
