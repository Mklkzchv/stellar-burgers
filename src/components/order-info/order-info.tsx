import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { selectIngredients } from '../../services/slices/IngredientsSlice';
import { fetchOrderByNumber } from '../../services/slices/FeedDataSlice';
import { useSelector, useDispatch } from '../../services/store';
import { selectOrderById } from '../../services/selector';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatchAction = useDispatch();

  const orderData = useSelector(selectOrderById(Number(number))); // берем переменную из стора
  const ingredients: TIngredient[] = useSelector(selectIngredients); // берем переменную из стора

  useEffect(() => {
    if (!orderData) {
      dispatchAction(fetchOrderByNumber(Number(number)));
    }
  }, [dispatchAction]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
