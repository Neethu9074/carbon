import React from 'react';

import landingImage from 'in-views/eumView/components/NewWebsite/landingImage.png';
import WebsiteHeading from 'in-views/eumView/components/WebsiteHeading';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import ValidationBlock from 'in-components/form/ValidationBlock';
import SaveError from 'in-components/form/SaveError';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

import './Form.less';

const block = 'in-new-website-form';

export default function NewWebsiteForm({ field, loading, saveError, onSubmit, onChange }) {
  return (
    <div>
      <img src={landingImage} className={`${block}__image`} />

      <WebsiteHeading className={`${block}__heading`} />

      <p className={`${block}__description`}>
        Get started with website monitoring to better understand how your website performance impacts user experience.
        Configuration is simple!
      </p>

      <DashboardTile interactable className={`${block}__tile`}>
        <form onSubmit={onSubmit}>
          <FormGroup className={`${block}__group`}>
            <Label htmlFor="website-name">
              Website Name
            </Label>

            {saveError && <SaveError>{saveError}</SaveError>}

            <div className={`${block}__action-wrapper`}>
              <Input
                id="website-name"
                type="text"
                autoFocus
                value={field.value}
                onChange={onChange}
                hasError={field.touched && !field.valid}
                className={`${block}__input`}
                disabled={loading}
              />
              <Button
                type="submit"
                kind="default"
                disabled={loading || (field.touched && !field.valid)}
                className={`${block}__button`}
              >
                Add Website
              </Button>
            </div>

            {field.touched &&
              field.messages.map((message, i) =>
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              )}
          </FormGroup>
        </form>
      </DashboardTile>
    </div>
  );
}
