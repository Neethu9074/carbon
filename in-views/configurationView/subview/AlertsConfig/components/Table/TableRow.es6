import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import {getAlertsConfigLink} from 'in-stores/navigation/configuration';
import {formatDurationAccurately} from 'in-services/formatters/date';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {evaluateClassNames} from 'in-services/util/classnames';
import {formatDateTime} from 'in-services/formatters/date';
import {toHtml} from 'in-services/formatters/markdown';
import PluginIcon from 'in-components/PluginIcon';
import Toggle from 'in-components/form/Toggle';
import {getSingular} from 'in-sdk/pluginName';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './TableRow.less';


const block = 'in-alerts-table-row';

export const TableRow = connectTo(props => {
  return {
    href: getAlertsConfigLink(props.alert.get('id'))
  };
},
function TableRow({alert, isSelected, onClick, onDeleteAlert, setEnabled, status, href}) {
  const alertId = alert.get('id');
  const alertName = alert.get('name');

  return (
    <li className={block}
        onClick={() => onClick(alert)}>
      <div className={evaluateClassNames({
             [`${block}__row`]: true,
             [`${block}__row--selected`]: isSelected
           })}>
        <Column>
          <a href={href}>
            {alertName}
          </a>
        </Column>

        <Column>
          <PluginIcon className={`${block}__entity-icon`}
                      dimension={24}
                      color='#000'
                      plugin={alert.getIn(['match', 'entityType'])} />
          {getSingular(alert.getIn(['match', 'entityType']))}
        </Column>

        <Column>
          <Toggle className={`${block}__toggle`}
                  checked={alert.get('enabled', false)}
                  onChange={e => setEnabled(alert, e.target.checked)} />

          <ModificationSaveStatus status={status}
                                  className={`${block}__save-status`}
                                  reserveSpace />
        </Column>

        <Column>
          <Button className={`${block}__button`}
                  size='sm'
                  kind='danger'
                  onClick={() => setActiveDialog(
                    <ConfirmationDialog header='Confirm removal'
                                        description={
                                          <span>
                                            Are you sure you want to remove the alert <strong>{alertName}</strong>?
                                          </span>
                                        }
                                        bButtonLabel='Remove alert'
                                        onB={() => onDeleteAlert(alertId)} />
                  )}>
            Delete
          </Button >
        </Column>
      </div>

      {isSelected ?<Details alert={alert} /> : null}
    </li>
  );
});

function Column({children}) {
  return (
    <div className={`${block}__column`}>
      {children}
    </div>
  );
}

export function TableRowWrapper({children}) {
  return (
    <ul className={`${block}__wrapper`}>
      {children}
    </ul>
  );
}

function Details({alert}) {
  const match = alert.get('match');
  const event = alert.get('event');
  const rule = alert.get('rule');

  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title='Entity type'>
          <div className={`${block}__flex-wrapper`}>
            <PluginIcon className={`${block}__entity-icon`}
                        dimension={16}
                        color='#000'
                        plugin={match.get('entityType')} />
            {getSingular(match.get('entityType'))}
          </div>
        </DescriptionItem>
        <DescriptionItem title='Metric'>
          {match.get('metricName')}
        </DescriptionItem>
        <DescriptionItem title='Applied on filter query'>
          {match.get('query')}
        </DescriptionItem>
        <DescriptionItem title='Rollup in ms'>
          {formatDurationAccurately(match.get('rollup'), 1000)}
        </DescriptionItem>

        <DescriptionItem title='Time window'>
          {formatDurationAccurately(rule.get('window'), 1000)}
        </DescriptionItem>
        <DescriptionItem title='Aggregation'>
          {rule.get('aggregation')}
        </DescriptionItem>
        <DescriptionItem title='Condition'>
          {`${rule.get('conditionOperator')} ${rule.get('conditionValue')}`}
        </DescriptionItem>

        <DescriptionItem title='Triggering'>
          {String(event.get('triggering'))}
        </DescriptionItem>
        <DescriptionItem title='Severity'>
          {mapSeverityToLabel(event.get('severity'))}
        </DescriptionItem>
        <DescriptionItem title='Text'>
          {event.get('text')}
        </DescriptionItem>
        <DescriptionItem title='Description'>
          <span dangerouslySetInnerHTML={{__html: toHtml(event.get('description'))}} />
        </DescriptionItem>

        <DescriptionItem title='Last update'>
          {formatDateTime(alert.get('lastUpdated'))}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}

function mapSeverityToLabel(severity) {
  if (severity === 0) {
    return 'change';
  } else if (severity === 5) {
    return 'warning';
  } else {
    return 'critical';
  }
}
