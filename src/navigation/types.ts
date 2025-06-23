export type RootTabParamList = {
  Home: undefined;
  Customers: undefined;
  MakeBill: undefined;
  Profile: undefined;
};

export type BottomTabNavigationProps<T extends keyof RootTabParamList> = {
  navigation: any; // We'll properly type this
  route: {
    key: string;
    name: T;
    params: RootTabParamList[T];
  };
};