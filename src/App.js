import React, { lazy, Suspense } from "react"
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import PrivateLayouts from 'layouts/PrivateLayouts'
import PageLoader from 'layouts/PageLoader'

const Login = lazy(() => import('./views/login'))
const Category = lazy(() => import('./views/category'))
const Dashboard = lazy(() => import('./views/dashboard'))
const Servers = lazy(() => import('./views/servers'))
const Websites = lazy(() => import('./views/websites'))

function App() {
    return (
        <Layout className="app-layout">
            <Suspense fallback={<div>Loading....</div>}>
                <Routes>
                    <Route exact path='/' element={<Login />}></Route>
                    <Route exact path='/login' element={<Login />}></Route>
                    <Route element={<PrivateLayouts />}>
                        <Route exact path='/dashboard' element={<Dashboard />}></Route>
                        <Route exact path='/category' element={<Category />}></Route>
                        <Route exact path='/servers' element={<Servers />}></Route>
                        <Route exact path='/websites' element={<Websites />}></Route>
                    </Route>
                </Routes>
            </Suspense>
        </Layout>
    );
}

export default App;
