import App10ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList/App10ServiceInstancesList';
import App20ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList/App20ServiceInstancesList';
import { newApplicationMonitoringEnabled } from 'in-services/featureFlags';

export default (newApplicationMonitoringEnabled ? App20ServiceInstancesList : App10ServiceInstancesList);
