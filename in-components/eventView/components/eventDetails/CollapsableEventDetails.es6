import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDetailsContent from 'in-components/eventView/components/eventDetails/EventDetailContent';
import EntityInformation from 'in-components/eventView/components/eventDetails/EntityInformation';
import EventIcon from 'in-components/EventIcon/EventIcon';
import SvgIcon from 'in-components/SvgIcon';

import './CollapsableEventDetails.less';


const rpt = React.PropTypes;
const block = 'in-event-view-event-details';

export default React.createClass({

  displayName: 'CollapsableEventDetails',

  propTypes: {
    event: irpt.map.isRequired,
    withEventHeader: rpt.bool,
    isCollapsed: rpt.bool
  },

  getInitialState() {
    return {
      isCollapsed: true
    };
  },

  componentWillMount() {
    this.setState({
      isCollapsed: this.props.isCollapsed
    });
  },

  render() {
    const isCollapsed = this.state.isCollapsed;
    const event = this.props.event;

    let headerClassName = `${block}__header`;
    if (isCollapsed) {
      headerClassName += ` ${headerClassName}--collapsed`;
    }

    return (
      <div className={block}>

        <div className={headerClassName}
             onClick={() => this.setState({isCollapsed: !isCollapsed})}>

          <div className={`${block}__flex-wrapper`}>
            <EventIcon event={event}
                       className={`${block}__icon`} />
            <EntityInformation event={event} />
            {isCollapsed
              ? event.get('title')
              : null
            }
          </div>

          <SvgIcon type={isCollapsed ? 'plus_without_frame' : 'minus'}
                   width={10}
                   height={10}
                   color={'#7b8e96'} />
        </div>

        {isCollapsed
          ? null
          : <EventDetailsContent event={event}/>
        }
      </div>
    );
  }
});
