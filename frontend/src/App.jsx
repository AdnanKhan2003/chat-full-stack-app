import { createBrowserRouter, Navigate } from 'react-router'
import './App.css'
import ChatMessages from './components/App/ChatMessages/ChatMessages'
import Header from './components/App/Header/Header'
import Sidebar from './components/App/Sidebar/Sidebar'
import HomePage from './pages/HomePage/HomePage'
import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { checkAuth } from './store/thunks/authThunk'
import SignupPage from './pages/SignupPage/SignupPage'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage/LoginPage'
import SearchBox from './components/App/SearchBox/SearchBox'



function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.isAuth);
  const isAuth = useSelector(state => state.isAuth.user);


  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if(isLoading) {
    return <h1>Loading...</h1>
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuth ? <HomePage /> : <SignupPage />,
      children: [
        {
          path: "/search",
          element: <SearchBox />,
        }
      ],    
    },
    {
      path: '/signup',
      element: !isAuth ? <SignupPage /> : <Navigate to="/" />
    },
    {
      path: '/login',
      element: !isAuth ? <LoginPage /> : <Navigate to="/" />
    },
  ]);


  return (
        <RouterProvider router={router} />
  );
}

export default App
