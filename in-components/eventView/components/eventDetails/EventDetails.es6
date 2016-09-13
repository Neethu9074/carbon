import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/eventDetails/EventDependecyGraph.es6';
import ShortEventInformation from 'in-components/eventView/components/eventDetails/ShortEventInformation';
import EntityInformation from 'in-components/eventView/components/eventDetails/EntityInformation';
import EventTimerange from 'in-components/eventView/components/eventDetails/EventTimerange.es6';
import EventTraces from 'in-components/eventView/components/eventDetails/EventTraces.es6';
import EventChart from 'in-components/eventView/components/eventDetails/EventChart.es6';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {toHtml} from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';

import './EventDetails.less';


const block = 'in-event-view-event-details';

export default React.createClass({

  displayName: 'EventDetails',

  propTypes: {
    event: irpt.map.isRequired
  },

  getInitialState() {
    return {
      isCollapsed: true
    };
  },

  render() {
    const isCollapsed = this.state.isCollapsed;
    const event = this.props.event;

    let headerClassName = `${block}__header`;
    if (isCollapsed) {
      headerClassName += ` ${headerClassName}--collapsed`;
    }

    return (
      <Section>
        <div className={block}>
          <div className={headerClassName}
               onClick={() => this.setState({isCollapsed: !isCollapsed})}>
            <div>
              <ShortEventInformation event={event} />
              <br/>
              <span className={`${block}__problem-text`}>
                {event.getIn(['problem', 'problemText'])}
              </span>
            </div>

            <SvgIcon type={isCollapsed ? 'plus_without_frame' : 'minus'}
                     width={10}
                     height={10}
                     color={'#7b8e96'} />
          </div>
          {isCollapsed ? null : <Details event={event}/>}
        </div>
      </Section>
    );
  }
});

function Details({event}) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion']));

  return (
    <div>
      <EntityInformation event={event}/>

      <div className={`${block}__suggestion`}
           dangerouslySetInnerHTML={{__html: fixSuggestion}} />

      <EventChart event={event} />
      <EventTimerange event={event} />
      <EventDependecyGraph event={event} />
      <EventTraces event={event} />
    </div>
  );
}
