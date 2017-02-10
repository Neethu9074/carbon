import React from 'react';

import {addOrUpdateAlert, removeAlert} from 'in-services/groundskeeper/alertings';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import {setActiveDialog} from 'in-components/DialogPresenter/store';
import {openAlertConfig} from 'in-stores/navigation/configuration';
import {evaluateClassNames} from 'in-services/util/classnames';
import {toHtml} from 'in-services/formatters/markdown';
import Toggle from 'in-components/form/Toggle';
import Button from 'in-components/Button';

import './TableRow.less';


const block = 'in-table-row';

export function TableRow({data, isSelected, onClick}) {
  const alertId = data.get('id');

  return (
    <li className={block}
        onClick={() => onClick(data)}>
      <div className={evaluateClassNames({
             [`${block}__row`]: true,
             [`${block}__row--selected`]: isSelected
           })}>
        <Column>
          {alertId}
        </Column>

        <Column>
          {data.getIn(['data', 'name'])}
        </Column>

        <Column>
          <Toggle className={`${block}__toggle`}
                  checked={data.getIn(['data', 'enabled'], false)}
                  onChange={e => addOrUpdateAlert(data.setIn(['data', 'enabled'], e.target.checked))} />
        </Column>

        <Column>
          {data.getIn(['data', 'entityType'])}
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
                                            Are you sure you want to remove the alert <strong>{data.getIn(['data', 'name'])}</strong>?
                                          </span>
                                        }
                                        bButtonLabel='Remove role'
                                        onB={() => {
                                          removeAlert(data.get('id'));
                                          close();
                                        }} />
                  )}>
            Remove
          </Button >
        </Column>
      </div>

      {isSelected ?<Details data={data} /> : null}
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


function Details({data}) {
  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title='Description'>
          <span dangerouslySetInnerHTML={{__html: toHtml(data.getIn(['data', 'description']))}} />
        </DescriptionItem>
        <DescriptionItem title='Event Text'>
          <span dangerouslySetInnerHTML={{__html: toHtml(data.getIn(['data', 'eventText']))}} />
        </DescriptionItem>
        <DescriptionItem title='Severity'>
          {data.getIn(['data', 'severity'])}
        </DescriptionItem>
        <DescriptionItem title='Metric'>
          {data.getIn(['data', 'metricName'])}
        </DescriptionItem>
        <DescriptionItem title='Is Triggering'>
          {String(data.getIn(['data', 'isTriggering']))}
        </DescriptionItem>
        <DescriptionItem title='Rollup in ms'>
          {data.getIn(['data', 'rollup'])}
        </DescriptionItem>
        <DescriptionItem title='Aggregation'>
          {data.getIn(['data', 'aggregation'])}
        </DescriptionItem>
        <DescriptionItem title='Condition'>
          {`${data.getIn(['data', 'threshold'])} ${data.getIn(['data', 'thresholdValue'])}`}
        </DescriptionItem>
        <DescriptionItem title='Filter Query'>
          {data.getIn(['data', 'query'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
