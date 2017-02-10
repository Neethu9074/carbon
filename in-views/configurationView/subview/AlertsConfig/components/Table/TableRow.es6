import React from 'react';

import {addOrUpdateAlert, removeAlert} from 'in-services/groundskeeper/alertings';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
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
  const data = alert.get('data');

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
          {data.get('name')}
        </Column>

        <Column>
          <Toggle className={`${block}__toggle`}
                  checked={data.get('enabled', false)}
                  onChange={e => addOrUpdateAlert(alert.setIn(['data', 'enabled'], e.target.checked))} />
        </Column>

        <Column>
          {getSingular(data.get('entityType'))}
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
                                            Are you sure you want to remove the alert <strong>{data.get('name')}</strong>?
                                          </span>
                                        }
                                        bButtonLabel='Remove role'
                                        onB={() => {
                                          removeAlert(alertId);
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
  const data = alert.get('data');
  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title='Description'>
          <span dangerouslySetInnerHTML={{__html: toHtml(data.get('description'))}} />
        </DescriptionItem>
        <DescriptionItem title='Event Text'>
          <span dangerouslySetInnerHTML={{__html: toHtml(data.get('eventText'))}} />
        </DescriptionItem>
        <DescriptionItem title='Severity'>
          {data.get('severity')}
        </DescriptionItem>
        <DescriptionItem title='Entity Type'>
          {getSingular(data.get('entityType'))}
        </DescriptionItem>
        <DescriptionItem title='Metric'>
          {data.get('metricName')}
        </DescriptionItem>
        <DescriptionItem title='Is Triggering'>
          {String(data.get('isTriggering'))}
        </DescriptionItem>
        <DescriptionItem title='Rollup in ms'>
          {formatDurationAccurately(data.get('rollup'))}
        </DescriptionItem>
        <DescriptionItem title='Aggregation'>
          {data.get('aggregation')}
        </DescriptionItem>
        <DescriptionItem title='Window'>
          {formatDurationAccurately(data.get('window'))}
        </DescriptionItem>
        <DescriptionItem title='Condition'>
          {`${data.get('threshold')} ${data.get('thresholdValue')}`}
        </DescriptionItem>
        <DescriptionItem title='Filter Query'>
          {data.get('query')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
