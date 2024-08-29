import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { Navigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { TLoginData } from '../../utils/burger-api';
import {
  selectIsAuthenticated,
  authenticateUser
} from '../../services/slices/UserInfoSlice';
import { useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatchAction = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const userLogin: TLoginData = {
      email: email,
      password: password
    };
    dispatchAction(authenticateUser(userLogin));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
