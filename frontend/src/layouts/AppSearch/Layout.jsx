import { Outlet, useLocation } from 'react-router';

import App from '../../App';
import styles from './Layout.module.css';
import SearchBox from '../../components/App/SearchBox/SearchBox';

const Layout = () => {
    const location = useLocation();

  return (
    <>
        <App />
        {location.pathname === '/search' && <SearchBox />}
        <Outlet />
    </>
  )
}

export default Layout