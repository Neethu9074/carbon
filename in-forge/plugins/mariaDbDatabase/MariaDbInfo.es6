import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {formatDateTime} from 'in-services/formatters/date';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const MariaDbInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const startedAt = data.get('startedAt');
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
          {startedAt != null ?
            formatDateTime(startedAt)
          : null}
        </DescriptionItem>
        <DescriptionItem title='Role'>
          {data.get('role')}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  getVersion(data) {
    const variables = data.get('variables');
    if (!variables) {
      return null;
    }

    const version = variables.get('VERSION');
    const comment = variables.get('VERSION_COMMENTS');

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

export default MariaDbInfo;
