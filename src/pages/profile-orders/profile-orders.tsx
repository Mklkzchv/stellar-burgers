import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  ordersHistory,
  getOrdersLoadingStatus,
  getUserOrdersList
} from '../../services/slices/UserOrdersHistory';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getUserOrdersList);
  const dispatchAction = useDispatch();
  const isLoading = useSelector(getOrdersLoadingStatus);

  useEffect(() => {
    dispatchAction(ordersHistory());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
