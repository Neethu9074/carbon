import App20ServiceListPresenter from 'in-sdk/components/sidebar/ServiceInstancesList/App20ServiceListPresenter';
import getServices from 'in-subscription/application/getServices';
import { timeConfig$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshot }) => ({
    result: timeConfig$.flatMap(timeConfig =>
      getServices({
        pagination: {
          page: 1,
          pageSize: 100
        },
        order: {
          by: 'serviceLabel',
          direction: 'ASC'
        },
        metrics: {},
        filter: {
          timeConfig,
          processReference: snapshot.get('entityId')
        }
      })
    )
  }),
  App20ServiceListPresenter
);
