import React from 'react';
import Header from './common/header-component/header';
import Sidebar from './common/sidebar-component/sidebar';
import RightSidebar from './common/right-sidebar';
import Footer from './common/footer';
import ThemeCustomizer from './common/theme-customizer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './common/loader';
import { useTranslation } from 'react-i18next';

const AppLayout = ({children}) => {
        const { t, i18n } = useTranslation();

        return (
            <div>
                <Loader />
                <div className="page-wrapper">
                    <div className="page-body-wrapper">
                        <Header />
                        <Sidebar langT={t} />
                        <RightSidebar />
                        <div className="page-body">
                            {children}
                        </div>
                        <Footer />
                        <ThemeCustomizer />
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
}

export default AppLayout;