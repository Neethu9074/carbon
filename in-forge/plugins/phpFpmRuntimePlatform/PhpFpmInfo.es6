import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';


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
          <DescriptionItem title='Master Process ID'>
            {data.get('pid')}
          </DescriptionItem>
        </DescriptionList>
          {pools.map(pool =>
            <Collapsible initiallyOpen={true} key={pool}>
              <Collapsible.Header>Worker Pool: {data.get('worker_pool.' + pool + '.pool')}</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  <DescriptionItem title='Process Manager'>
                    {data.get('worker_pool.' + pool + '.process_manager')}
                  </DescriptionItem>
                  {data.get('worker_pool.' + pool + '.start_time') !== null ?
                    <DescriptionItem title='Start Time'>
                      {formatDateTime(data.get('worker_pool.' + pool + '.start_time'))}
                    </DescriptionItem>
                    : null}
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          )}
      </div>
    );
  }
});

export default PhpFpmInfo;
