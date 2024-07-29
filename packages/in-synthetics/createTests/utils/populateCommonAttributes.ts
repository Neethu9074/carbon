/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

interface Props {
  form: MapForm<any>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const populateCommonAttributes = ({ form, commonAttributes, setCommonAttributes }: Props) => {
  commonAttributes['syntheticType'] = form.get('configuration').get('syntheticType').value;
  commonAttributes['url'] = form.get('configuration').get('url')?.value;
  commonAttributes['testFrequency'] = form.get('testFrequency').value;
  commonAttributes['locations'] = form.get('locations').value;
  commonAttributes['label'] = form.get('label').value;
  commonAttributes['description'] = form.get('description').value;
  commonAttributes['applicationId'] = form.get('applicationId')?.value;
  commonAttributes['script'] = form.get('configuration').get('script')?.value;
  commonAttributes['applications'] = form.get('applications')?.value ?? [];
  commonAttributes['websites'] = form.get('websites')?.value ?? [];
  commonAttributes['mobileApps'] = form.get('mobileApps')?.value ?? [];
  setCommonAttributes(commonAttributes);
};

export default populateCommonAttributes;
