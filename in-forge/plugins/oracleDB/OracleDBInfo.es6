import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import moment from 'moment';
import irpt from 'react-immutable-proptypes';

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
          {moment(data.get('startedAt')).format()}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default OracleDBInfo;
