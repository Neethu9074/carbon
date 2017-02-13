import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {saveAlert, deleteAlert} from 'in-services/groundskeeper/alertings';
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

export function TableRow({alert, isSelected, onClick}) {
  const alertId = alert.get('id');

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
          {alert.get('name')}
        </Column>

        <Column>
          <Toggle className={`${block}__toggle`}
                  checked={alert.get('enabled', false)}
                  onChange={e => saveAlert(alert.set('enabled', e.target.checked))} />
        </Column>

        <Column>
          {getSingular(alert.get('entityType'))}
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
                                            Are you sure you want to remove the alert <strong>{alert.get('name')}</strong>?
                                          </span>
                                        }
                                        bButtonLabel='Remove role'
                                        onB={() => {
                                          deleteAlert(alertId);
                                          close();
                                        }} />
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
  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title='Description'>
          <span dangerouslySetInnerHTML={{__html: toHtml(alert.get('description'))}} />
        </DescriptionItem>
        <DescriptionItem title='Event Text'>
          <span dangerouslySetInnerHTML={{__html: toHtml(alert.get('eventText'))}} />
        </DescriptionItem>
        <DescriptionItem title='Severity'>
          {alert.get('severity')}
        </DescriptionItem>
        <DescriptionItem title='Entity Type'>
          {getSingular(alert.get('entityType'))}
        </DescriptionItem>
        <DescriptionItem title='Metric'>
          {alert.get('metricName')}
        </DescriptionItem>
        <DescriptionItem title='Is Triggering'>
          {String(alert.get('isTriggering'))}
        </DescriptionItem>
        <DescriptionItem title='Rollup in ms'>
          {formatDurationAccurately(alert.get('rollup'))}
        </DescriptionItem>
        <DescriptionItem title='Aggregation'>
          {alert.get('aggregation')}
        </DescriptionItem>
        <DescriptionItem title='Window'>
          {formatDurationAccurately(alert.get('window'))}
        </DescriptionItem>
        <DescriptionItem title='Condition'>
          {`${alert.get('threshold')} ${alert.get('thresholdValue')}`}
        </DescriptionItem>
        <DescriptionItem title='Filter Query'>
          {alert.get('query')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
