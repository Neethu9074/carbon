import React, { Fragment } from 'react';

import Applications, {
  getSelectedApplicationConfigsByName,
  applicationSelectionTableActions,
  getSelectedApplicationsForAlert,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/Applications';
import {
  applyOnOptions,
  scopeApplication,
  scopeEverything,
  scopeDfq
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import InputWithDFQSelectionList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/InputWithDFQSelectionList';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { Row, Col } from 'in-new-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { isBlank } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Step3.mless';

export default connectTo(props => {
  const selectedApplicationName = props.form.get('application') ? props.form.get('application').value : '';
  if (selectedApplicationName === null || isBlank(selectedApplicationName)) {
    return {
      existingApplication: null
    };
  }
  return {
    existingApplication: getSelectedApplicationConfigsByName(selectedApplicationName)
  };
})(Step3);

function Step3({ form, setForm, onChange, onChangeApplyOn, existingApplication }) {
  let selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];

  if (existingApplication) {
    existingApplication.forEach(app => {
      selectedApplicationIds.push(app.id);
    });
  }

  return (
    <Fragment>
      <SectionHeading>3. Scope</SectionHeading>
      <Row>
        <Col lg={6}>
          {form.get('applyOn').map(field => (
            <FormGroup>
              <Label htmlFor="alert-apply-on" hasError={!field.valid && field.touched}>
                Apply on (required)
              </Label>
              <ComboBox
                name="alert-apply-on"
                value={field.value}
                options={applyOnOptions}
                clearable={false}
                onChange={e => {
                  const updatedForm = onChangeApplyOn(form, e ? e.value : null);
                  if (updatedForm) {
                    setForm(updatedForm);
                  }
                }}
              />
              <TouchedMessages field={field} />
              {form.get('applyOn').value === scopeEverything && (
                <DescriptionText>
                  <strong>Caution!</strong> All events that match the event types will enter the notification stream.
                </DescriptionText>
              )}
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {form.get('applyOn').value === scopeDfq &&
            form.get('query').map(field => (
              <FormGroup>
                <Label htmlFor="config-query" hasError={!field.valid && field.touched}>
                  Dynamic Focus Query
                </Label>
                <InputWithDFQSelectionList
                  id="config-query"
                  placeholder={'e.g. entity.zone:"production" AND NOT event.text:"TCP*"'}
                  value={field.value}
                  onChange={value => onChange('query', value)}
                  hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
                />
                {form.get('queryValidationInProgress').value && (
                  <LoadingIndicator className={locals.queryLoading} inline />
                )}
                <BackendValidationMessages validationResult={form.get('validationResult').value} />
                <TouchedMessages field={field} />
                <DescriptionText>
                  A <strong>non-empty</strong> filter query which defines for which entities the configuration will be
                  applied. Select <i>&quot;Apply on: All available entities&quot;</i> if you want this rule to be
                  applied on all entities. For more information on syntax, please see our&nbsp;
                  <Link href="https://docs.instana.io/dynamic_focus/#syntax" external>
                    documentation
                  </Link>
                  .
                </DescriptionText>
              </FormGroup>
            ))}
        </Col>
      </Row>
      {form.get('applyOn').value === scopeApplication && (
        <FormGroup>
          <Applications
            setTitle={false}
            loadEntities={() => getSelectedApplicationsForAlert(selectedApplicationIds)}
            hasRowNavigation={false}
            noDataMessage="No Application Perspectives Selected"
            tableActions={applicationSelectionTableActions(form, setForm)}
            rightHeader={
              <SelectListDialogButton
                form={form}
                onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
                title="Add Application Perspectives"
                label="Add Application Perspectives"
                listComponent={Applications}
                listComponentRightHeader={noRightHeader}
                limit={10}
                hiddenIds={selectedApplicationIds}
                createSubmitLabel={numberOfItems =>
                  numberOfItems > 0
                    ? `Add ${numberOfItems} Application Perspective${numberOfItems > 1 ? 's' : ''}`
                    : 'Add'
                }
                requiresAtLeastOneMessage="Please select at least one application perspectives."
              />
            }
          />
          <TouchedMessages field={form.get('applicationIds')} />
        </FormGroup>
      )}
      <MatchingEntitiesIndicator form={form} />
    </Fragment>
  );
}

function MatchingEntitiesIndicator({ form }) {
  return (
    <div className={locals.matchingEntitiesIndicator}>
      {form.get('matchingEntitiesQueryInProgress').value && (
        <LoadingIndicator inline className={locals.matchingEntitiesQueryInProgressIndicator} />
      )}
      {!form.get('matchingEntitiesQueryInProgress').value &&
        form.get('matchingEntities').map(field => {
          const matchingEntities = field.value;
          if (!matchingEntities && matchingEntities != 0) {
            return null;
          }
          if (matchingEntities === 0) {
            return 'Your selection matches no events in the past 2 weeks';
          } else {
            return (
              <span>
                Your selection matches {matchingEntities >= 10000 ? '>' : ''} {matchingEntities}{' '}
                {matchingEntities === 1 ? 'event' : 'events'} over the past 2 weeks.
              </span>
            );
          }
        })}
    </div>
  );
}
