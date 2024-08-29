import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

import {
  getConstructorItems,
  getOrderStatus,
  getOrderDetails,
  createNewOrder,
  resetOrder
} from '../../services/slices/BurgerConstructorSlice';
import { selectIsAuthenticated } from '../../services/slices/UserInfoSlice';

export const BurgerConstructor: FC = () => {
  const dispatchAction = useDispatch();
  const navigate = useNavigate();

  // Получаем состояния из Redux с помощью селекторов
  const orderRequest = useSelector(getOrderStatus);
  const orderModalData = useSelector(getOrderDetails);

  const constructorItems = useSelector(getConstructorItems); // Ингредиенты, выбранные пользователем
  const isAuthorized = useSelector(selectIsAuthenticated);

  const onOrderClick = () => {
    if (!isAuthorized) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;

    const order = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun?._id
    ].filter(Boolean);

    dispatchAction(createNewOrder(order)); // Отправка действия создания заказа в Redux
  };

  const closeOrderModal = () => {
    dispatchAction(resetOrder());
    navigate('/');
  };

  // Использование useMemo для вычисления общей стоимости заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems] // Пересчет только при изменении constructorItems
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
