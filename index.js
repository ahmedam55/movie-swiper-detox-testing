/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { YellowBox } from 'react-native'

//as it's a dependency of react-native-offline, not in the codebase to be changed
YellowBox.ignoreWarnings([
  'Warning: NetInfo has been extracted from react-native core and will be removed in a future release',
])


AppRegistry.registerComponent(appName, () => App);
