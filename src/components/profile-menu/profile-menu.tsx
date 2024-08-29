import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logOutUserSession } from '../../services/slices/UserInfoSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatchAction = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatchAction(logOutUserSession()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed: ', error);
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
