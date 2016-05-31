import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {formatDateTime} from 'in-services/formatters/date';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const MySqlInfo = React.createClass({
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
        <DescriptionItem title='Port'>
          {data.get('port')}
        </DescriptionItem>
        <DescriptionItem title='Version'>
          {this.getVersion(data)}
        </DescriptionItem>
        <DescriptionItem title='Started At'>
          {formatDateTime(data.get('startedAt'))}
        </DescriptionItem>
        <DescriptionItem title='Role'>
          {data.get('role')}
        </DescriptionItem>
        <DescriptionItem title='Replication Group Name'>
          {data.get('replicationGroup')}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  getVersion(data) {
    const version = data.get('variables.VERSION');
    const comment = data.get('variables.VERSION_COMMENT');

    if (version && comment) {
      return (
        <span>
          {version}
          <br/>
          {comment}
        </span>
      );
    } else if (!version && comment) {
      return comment;
    } else if (version && !comment) {
      return version;
    }

    return null;
  }
});

export default MySqlInfo;
