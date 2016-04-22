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
    const serverInfo = this.props.snapshot.getIn(['data', 'serverInfo']);

    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {serverInfo.get('releaseVersion')}
        </DescriptionItem>
        <DescriptionItem title='Home'>
          {serverInfo.get('homeDir')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default JBossAsInfo;
