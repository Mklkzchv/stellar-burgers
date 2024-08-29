import { ConstructorPage } from '@pages';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation
} from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { Profile } from '../../pages/profile/profile';
import { verifyUserAuth } from '../../services/slices/UserInfoSlice';
import { ProtectedRoute } from '../protected-route';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/IngredientsSlice';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';

const App = () => {
  const navigate = useNavigate(); // Хук для навигации по маршрутам
  const currentLocation = useLocation(); // Хук для получения информации о текущем маршруте
  const dispatchAction = useDispatch(); // Хук для отправки экшенов в store

  const locationState = currentLocation.state as { background?: Location }; // Получаем состояние маршрута
  const modalBackground = locationState && currentLocation.state?.background;

  // Возврат на предыдущую страницу
  const closeModal = () => navigate(-1);

  // Получение списка ингредиентов
  useEffect(() => {
    dispatchAction(fetchIngredients());
  }, [dispatchAction]);

  // Проверка авторизации пользователя
  useEffect(() => {
    dispatchAction(verifyUserAuth());
  }, [dispatchAction]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={modalBackground || currentLocation}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {modalBackground && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={''} onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
