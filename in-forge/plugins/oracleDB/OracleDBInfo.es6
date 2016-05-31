import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {formatDateTime} from 'in-services/formatters/date';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const OracleDBInfo = React.createClass({
  mixins: [PureRenderMixin],

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
        <DescriptionItem title='Started At'>
          {formatDateTime(data.get('startedAt'))}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default OracleDBInfo;
