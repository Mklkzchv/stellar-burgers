import { FC } from 'react';
import { AppHeaderUI } from '@ui'; // Импортируем компонент пользовательского интерфейса
import { selectUser } from '../../services/slices/UserInfoSlice';
import { useSelector } from '../../services/store'; // Импортируем useSelector из Redux store для доступа к состоянию

export const AppHeader: FC = () => {
  const currentUserName = useSelector(selectUser); // Получаем данные о пользователе из состояния Redux

  return (
    <>
      <AppHeaderUI userName={currentUserName?.name} />
    </>
  );
};
