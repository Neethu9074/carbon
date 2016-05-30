import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {formatDateTime} from 'in-services/formatters/date';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const PostgreSqlInfo = React.createClass({
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
          {data.get('variables.VERSION')}
        </DescriptionItem>
        <DescriptionItem title='Started At'>
          {formatDateTime(data.get('variables.started_at'))}
        </DescriptionItem>
      </DescriptionList>
    );
  }});

export default PostgreSqlInfo;
