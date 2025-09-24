import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/layout.css';
import { Outlet } from 'react-router';
import MenuBar from '../compoents/MenuBar';

function Layout(props) {
    return (
        <div>
            <MenuBar/>
            <section>
                <Outlet/>
            </section>
        </div>
    );
}

export default Layout;