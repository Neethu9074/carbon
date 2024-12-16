/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { Message, Spacer, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { triggerScrollToInvalidItem$ } from 'in-alerting/smart-alerts/components/tearSheet/hooks/useScrollToFirstInvalidItem';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { removeInvalidFilters } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import AlertTypography from 'in-alerting/components/AlertTypography';
import SaveButton from 'in-components/form/SaveButton';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './TagFilterValidation.mless';

export default function TagFilterValidation({ form, close, QueryBuilder, updateForm, setStep }) {
  const alertConfigWithFormModel = form.toJS();

  const { rule, tagFilterExpression, threshold } = alertConfigWithFormModel;

  const updateTagFilterExpression = filteredTagFilterExpression => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  const { getTagCatalog } = useMemo(() => {
    const thresholdType = threshold.type;
    return getQueryBuilderForAlertType(rule?.alertType, thresholdType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rule?.alertType, threshold.type]);

  const timeConfig = useTimeConfig();

  const tagCatalogResult = useObservable(() => getTagCatalog({ timeConfig }), [getTagCatalog, timeConfig]);

  const availableTagFilters = tagCatalogResult?.data?.allTagNames;

  function clearInvalidFilter() {
    if (availableTagFilters && tagFilterExpression) {
      try {
        removeInvalidFilters(tagFilterExpression, availableTagFilters, updateTagFilterExpression);
      } catch (ignoreParsingError) {
        // An invalid tag expression can not be converted to the backend model.
        // Then we won't be able to remove invalid tags.
      }
      close();
    }
    // only trigger on a changed tag filter list:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  return (
    <Dialog
      withoutBodyPadding
      title={
        <AlertTypography
          variant="heading-200"
          color="color-700"
          content={t('in-alerting:smartAlerts.applications.tearSheet.editAdaptiveThreshold.title')}
        >
          <div>
            <AlertTypography
              variant="body-small"
              color="color-700"
              content={t('in-alerting:smartAlerts.applications.tearSheet.editAdaptiveThreshold.description')}
            />
          </div>
        </AlertTypography>
      }
      onClose={() => {
        close();
      }}
      className={locals.dialogWrapper}
    >
      <div className={locals.dialogContent}>
        <Message
          type="warning"
          inline
          title={t('in-alerting:smartAlerts.applications.tearSheet.invalidFilters')}
          description={t('in-alerting:smartAlerts.applications.tearSheet.invalidFilterWarning')}
          fullInlineWidth
        />
        <Spacer vertical="normal" />
        <Spacer vertical="xsmall" />
        <AlertTypography
          variant="body-regular"
          color="color700"
          content={t('in-alerting:smartAlerts.applications.tearSheet.filterWithInvalidAdaptiveThreshold')}
        />
        <Spacer vertical="xsmall" />
        <AlertFilterConfigurator QueryBuilderComponent={QueryBuilder} form={form} updateForm={updateForm} isReadOnly />
        <Spacer vertical="xsmall" />
        <Button kind="action" icon="lib_actions_edit" onClick={() => goToStep(setStep, 1, close)}>
          {t('in-alerting:smartAlerts.applications.tearSheet.editFilters')}
        </Button>
      </div>
      <div className={locals.dialogFooter}>
        <Button kind="secondary" onClick={() => close()}>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle')}
        </Button>
        <SaveButton type="submit" kind="primary" form={form} onClick={() => clearInvalidFilter()}>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.proceedTitle')}
        </SaveButton>
      </div>
    </Dialog>
  );
}

function goToStep(setStep, step, close) {
  triggerScrollToInvalidItem$.emit(true);
  setStep(step);
  close();
}
