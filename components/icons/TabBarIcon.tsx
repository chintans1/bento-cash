import { FontAwesome6 } from '@expo/vector-icons';

enum TabRoute {
  Dashboard = 'Dashboard',
  Transactions = 'Transactions',
  Accounts = 'Accounts',
  Charts = 'Charts',
  Settings = 'Settings',
}

const bottomTabIcons: Record<TabRoute, string> = {
  [TabRoute.Dashboard]: 'house',
  [TabRoute.Transactions]: 'money-bills',
  [TabRoute.Accounts]: 'piggy-bank',
  [TabRoute.Charts]: 'chart-line',
  [TabRoute.Settings]: 'user-gear',
};

interface TabBarIconProps {
  routeName: TabRoute;
  color: string;
  size: number;
}

export const getTabRoute = (routeName: string): TabRoute | undefined => {
  return Object.values(TabRoute).find(
    key => TabRoute[key as TabRoute] === routeName,
  );
};

function TabBarIcon({ routeName, color, size }: TabBarIconProps) {
  if (!routeName) {
    return null;
  }

  return (
    <FontAwesome6 name={bottomTabIcons[routeName]} color={color} size={size} />
  );
}

export default TabBarIcon;
