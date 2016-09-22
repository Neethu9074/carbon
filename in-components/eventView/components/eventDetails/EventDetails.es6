import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/eventDetails/EventDependecyGraph.es6';
import EntityInformation from 'in-components/eventView/components/eventDetails/EntityInformation';
import EventTraces from 'in-components/eventView/components/eventDetails/EventTraces.es6';
import EventChart from 'in-components/eventView/components/eventDetails/EventChart.es6';
import Section from 'in-components/eventView/components/eventDetails/Section';
import EventIcon from 'in-components/EventIcon/EventIcon';
import {toHtml} from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';

import './EventDetails.less';


const block = 'in-event-view-event-details';

export default React.createClass({

  displayName: 'EventDetails',

  propTypes: {
    isCollapsed: React.PropTypes.bool,
    event: irpt.map.isRequired
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
      <Section>
        <div className={block}>

          <div className={headerClassName}
               onClick={() => this.setState({isCollapsed: !isCollapsed})}>

            <div className={`${block}__flex-wrapper`}>
              <EventIcon event={event}
                         className={`${block}__icon`} />
              <EntityInformation event={event} />
              {isCollapsed
                ? <ProblemTextPreview text={event.get('title')} />
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
            : <FurtherContent event={event}/>
          }
        </div>
      </Section>
    );
  }
});

function ProblemTextPreview({text}) {
  return (
    <div className={`${block}__problem-text--preview`}>
      {text}
    </div>
  );
}

function FurtherContent({event}) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion']));

  return (
    <div>
      <span className={`${block}__problem-text`}>
        {event.get('title')}
      </span>

      <div className={`${block}__suggestion`}
           dangerouslySetInnerHTML={{__html: fixSuggestion}} />

      <EventChart event={event} />
      <EventDependecyGraph event={event} />
      <EventTraces event={event} />
    </div>
  );
}
