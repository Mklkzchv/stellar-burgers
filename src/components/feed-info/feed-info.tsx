import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

import {
  getOrderList,
  getOrdersToday,
  getTotalOrders
} from '../../services/slices/FeedDataSlice';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20); // max 20 заказов

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getOrderList);
  const totalAmountToday = useSelector(getOrdersToday);
  const totalAmount = useSelector(getTotalOrders);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total: totalAmount, totalToday: totalAmountToday }}
    />
  );
};
