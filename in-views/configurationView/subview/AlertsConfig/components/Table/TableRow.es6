import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import {formatDurationAccurately} from 'in-services/formatters/date';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {openAlertConfig} from 'in-stores/navigation/configuration';
import {evaluateClassNames} from 'in-services/util/classnames';
import {toHtml} from 'in-services/formatters/markdown';
import Toggle from 'in-components/form/Toggle';
import {getSingular} from 'in-sdk/pluginName';
import Button from 'in-components/Button';

import './TableRow.less';


const block = 'in-table-row';

export function TableRow({alert, isSelected, onClick, onDeleteAlert, setEnabled, status}) {
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
          {alertId}
        </Column>

        <Column>
          {alertName}
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
          {getSingular(alert.getIn(['match', 'entityType']))}
        </Column>

        <Column>
          <Button className={`${block}__button`}
                  size='sm'
                  kind='success'
                  onClick={() => openAlertConfig(alertId)}>
            Edit
          </Button >
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
            Remove
          </Button >
        </Column>
      </div>

      {isSelected ?<Details alert={alert} /> : null}
    </li>
  );
}

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
        <DescriptionItem title='Entity-Type'>
          {getSingular(match.get('entityType'))}
        </DescriptionItem>
        <DescriptionItem title='Metric'>
          {match.get('metricName')}
        </DescriptionItem>
        <DescriptionItem title='Filter Query'>
          {match.get('query')}
        </DescriptionItem>
        <DescriptionItem title='Rollup in ms'>
          {formatDurationAccurately(match.get('rollup'))}
        </DescriptionItem>

        <DescriptionItem title='Window'>
          {formatDurationAccurately(rule.get('window'))}
        </DescriptionItem>
        <DescriptionItem title='Aggregation'>
          {rule.get('aggregation')}
        </DescriptionItem>
        <DescriptionItem title='Condition'>
          {`${rule.get('conditionOperator')} ${rule.get('conditionValue')}`}
        </DescriptionItem>

        <DescriptionItem title='Is triggering'>
          {String(event.get('triggering'))}
        </DescriptionItem>
        <DescriptionItem title='Severity'>
          {event.get('severity')}
        </DescriptionItem>
        <DescriptionItem title='Event text'>
          <span dangerouslySetInnerHTML={{__html: toHtml(event.get('text'))}} />
        </DescriptionItem>
        <DescriptionItem title='Description'>
          <span dangerouslySetInnerHTML={{__html: toHtml(event.get('description'))}} />
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
