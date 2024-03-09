import { Fragment, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import DefaultLayout from './layouts';
import { AccountLoginContext } from './context/AccountLoginContext';
import config from './config';

function App() {
    const { userId, permission } = useContext(AccountLoginContext);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout = DefaultLayout;

                        if (route.layout === null) {
                            Layout = Fragment;
                        } else if (route.layout) {
                            Layout = route.layout;
                        }

                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {privateRoutes.map((route, index) => {
                        let Layout = DefaultLayout;

                        if (route.layout === null) {
                            Layout = Fragment;
                        } else if (route.layout) {
                            Layout = route.layout;
                        }
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    userId !== 0 ? (
                                        (permission !== null && route.admin) ||
                                        (permission === null && route.admin === undefined) ? (
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        ) : (
                                            <Navigate to={config.routes.login} replace={true} />
                                        )
                                    ) : (
                                        <Navigate to={config.routes.login} replace={true} />
                                    )

                                    // userLogin !== 0 &&
                                    // ((user.permission !== null && route.admin) ||
                                    //     (user.permission === null && route.admin !== undefined)) ? (

                                    // ) : (

                                    // )
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
