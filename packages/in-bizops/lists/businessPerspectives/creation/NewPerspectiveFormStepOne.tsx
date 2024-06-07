/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Li, Ul } from '@instana/components';

import { BusinessProcessQueryBuilder } from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ProcessesLiveList from 'in-bizops/lists/businessPerspectives/creation/ProcessesLiveList';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

interface NewPerspectiveFormStepOneProps {
  form: any;
  updateForm: any;
  blueprintCatalogResult: any;
  processesLiveList: any;
}

export function NewPerspectiveFormStepOne({
  form,
  updateForm,
  blueprintCatalogResult,
  processesLiveList
}: NewPerspectiveFormStepOneProps) {
  // Display loading state
  if (!blueprintCatalogResult || blueprintCatalogResult?.progress?.loading) {
    return null;
  }

  const tagFilterExpressionField = form.get('tagFilterExpression');

  return (
    <SimpleModeStepContentWrapper headline={t('in-bizops:perspectives.dialog.stepOne.headline')}>
      <div className={locals.contentParent}>
        <div className={locals.leftContent}>
          <Ul>
            <Li forceAlternateBg>{t('in-bizops:perspectives.dialog.stepOne.queryBuilderTitle')}</Li>
          </Ul>
          <Ul>
            <Li>
              <div className={locals.queryBuilder}>
                <BusinessProcessQueryBuilder
                  value={tagFilterExpressionField.value}
                  onChange={(tagFilterExpression: any) =>
                    setTagFilterExpression({ tagFilterExpression, form, updateForm })
                  }
                />
              </div>
            </Li>
          </Ul>
        </div>
        <div className={locals.rightContent}>
          <ProcessesLiveList processesLiveList={processesLiveList} />
        </div>
      </div>
    </SimpleModeStepContentWrapper>
  );
}

interface setTagFilterExpressionProps {
  tagFilterExpression: FormModelElement[];
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

function setTagFilterExpression({ tagFilterExpression, form, updateForm }: setTagFilterExpressionProps) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}
