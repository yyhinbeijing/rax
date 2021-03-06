import invariant from 'invariant';

import getScreenForRouteName from './getScreenForRouteName';
import addNavigationHelpers from '../addNavigationHelpers';


export default (
  routeConfigs,
  defaultOptions
) =>
  (
    navigation,
    optionName,
    config
  ) => {
    const route = navigation.state;
    invariant(
      route.routeName &&
      typeof route.routeName === 'string',
      'Cannot get config because the route does not have a routeName.'
    );

    const Component = getScreenForRouteName(routeConfigs, route.routeName);

    let outputConfig = config || null;

    if (Component.router) {
      const { state, dispatch } = navigation;
      invariant(
        state && state.routes && state.index != null,
        `Expect nav state to have routes and index, ${JSON.stringify(route)}`
      );
      const childNavigation = addNavigationHelpers({
        state: state.routes[state.index],
        dispatch,
      });
      outputConfig = Component.router.getScreenConfig(childNavigation, optionName);
    }

    const routeConfig = routeConfigs[route.routeName];

    return [
      defaultOptions,
      Component.navigationOptions,
      routeConfig.navigationOptions,
    ].reduce(
      (acc, options) => {
        if (options && options[optionName] !== undefined) {
          return typeof options[optionName] === 'function'
            ? options[optionName](navigation, acc)
            : options[optionName];
        }
        return acc;
      },
      outputConfig,
    );
  };
