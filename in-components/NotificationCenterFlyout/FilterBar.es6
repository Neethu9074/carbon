import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {mapSeverityToHealth} from 'in-services/health';
import {emptyArray} from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import {FILTER_TYPES, Issue$} from './stores';
import Filter from './Filter';

import './FilterBar.less';


const block = 'in-notificationcenter-filterbar';

export default connectTo(
  () => {
    return {
      allIssues: Issue$
    };
  },
  React.createClass({

    displayName: 'NotificationFilterBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      allIssues: irpt.list
    },

    render() {
      const counter = this.getIssuesCounter();

      return (
        <div className={block}>
          <Filter label={'All'}
                  filter = {FILTER_TYPES.ALL}/>

          <Filter label={'' + counter.errors}
                  filter={FILTER_TYPES.CRITICAL}/>

          <Filter label={'' + counter.warnings}
                  filter={FILTER_TYPES.WARNING}/>

          <Filter label={'' + counter.ok}
                  filter={FILTER_TYPES.SYSTEM}/>
        </div>
      );
    },

    getIssuesCounter() {
      const counter = {
        warnings: 0,
        errors: 0,
        ok: 0
      };

      const allIssues = this.props.allIssues || emptyArray;
      allIssues.forEach(issue => {
        const issueHealth = mapSeverityToHealth(issue.getIn(['problem', 'severity']));
        if (!issueHealth) {
          return;
        }

        counter[issueHealth]++;
      });

      return counter;
    }
  })
);
