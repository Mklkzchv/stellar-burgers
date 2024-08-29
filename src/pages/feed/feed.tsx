import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { fetchOrderFeed } from '../../services/slices/FeedDataSlice';
import {
  getOrderList,
  getLoadingState
} from '../../services/slices/FeedDataSlice';
import { useSelector, useDispatch } from '../../services/store';

export const Feed: FC = () => {
  const loading = useSelector(getLoadingState);
  const dispatchAction = useDispatch();

  useEffect(() => {
    dispatchAction(fetchOrderFeed()).then((result) => {});
  }, [dispatchAction]);

  const orders: TOrder[] = useSelector(getOrderList);

  if (loading || !orders.length) {
    return <Preloader />;
  }

  const handleGetAllOrders = () => {
    dispatchAction(fetchOrderFeed());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetAllOrders} />;
};
