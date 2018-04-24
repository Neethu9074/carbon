import App10ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList/App10ServiceInstancesList';
import App20ServiceList from 'in-sdk/components/sidebar/ServiceInstancesList/App20ServiceList';
import { twoZeroModeEnabled } from 'in-services/featureFlags';

export default (twoZeroModeEnabled ? App20ServiceList : App10ServiceInstancesList);
