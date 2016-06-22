import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';
import KeyValuePopup from 'in-components/KeyValuePopup';

const PhpFpmInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const pools = data.get('worker_pools').toArray();

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title='Master Process ID'>{data.get('pid')}</DescriptionItem>
        </DescriptionList>

        <KeyValuePopup header='Master Configuration'
                       data={data.filter((v, k) => k.indexOf('worker_pool') === -1) } />

        {pools.map(pool =>
          <Collapsible initiallyOpen={true} key={pool}>
            <Collapsible.Header>Worker Pool: {pool}</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                {
                  data.get('worker_pool.' + pool + '.start_time')
                  ? <DescriptionItem title='Start Time'>
                    {formatDateTime(data.get('worker_pool.' + pool + '.start_time') * 1000)}
                    </DescriptionItem>
                  : null
                }
                <DescriptionItem title='Process Manager'>
                  {data.get('worker_pool.' + pool + '.pm')}
                </DescriptionItem>
                <DescriptionItem title='Status Path'>
                  {data.get('worker_pool.' + pool + '.pm_status_path')}
                </DescriptionItem>
                <DescriptionItem title='Ping Path'>
                  {data.get('worker_pool.' + pool + '.ping_path')}
                </DescriptionItem>
                <DescriptionItem title='User'>
                  {data.get('worker_pool.' + pool + '.user')}
                </DescriptionItem>
                <DescriptionItem title='Group'>
                  {data.get('worker_pool.' + pool + '.group')}
                </DescriptionItem>
              </DescriptionList>

              <KeyValuePopup header='Worker Pool Configuration'
                             data={data.filter(
                               (v, k) => k.indexOf('worker_pool.' + pool) === 0)
                               .mapKeys(
                                 k => k.split('worker_pool.' + pool + '.')[1])
                               } />
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  }
});

export default PhpFpmInfo;
