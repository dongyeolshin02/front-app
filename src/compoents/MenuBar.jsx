import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useNavigate } from 'react-router';
import { authStore } from '../store/authStore';
import { NavDropdown } from 'react-bootstrap';

function MenuBar(props) {

    const {isAuthenticated, clearAuth, getUserRole} = authStore();
    //랜더링 피하기 위해 필요한 것만 가져옴
    const userName = authStore((state)=> state.userName);
    const navigate = useNavigate();

    const handleLogout = () =>{
        clearAuth();
        localStorage.removeItem("auth-info");
        navigate('/login');
    }

    return (
        <Navbar className="bg-body-tertiary">
            <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/board" className={ ({isActive})=> isActive ? 'active' : ''}>게시판</Nav.Link>
                <Nav.Link as={NavLink} to="/gal"   className={ ({isActive})=> isActive ? 'active' : ''}>이미지게시판</Nav.Link>
            </Nav>
                 {
                    isAuthenticated() && getUserRole() ==='ROLE_ADMIN' &&
                     ( <Nav.Link as={NavLink}   to ='/admin' > 관리자 페이지</Nav.Link> )
                 }
            <Navbar.Collapse className="justify-content-end" style={{marginRight : '50px'}}>
                {
                    isAuthenticated() ?
                    (
                         <>
                            <NavDropdown title={userName} id="navbarScrollDropdown">
                            <NavDropdown.Item href="#">회원정보</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>로그아웃</NavDropdown.Item>
                          </NavDropdown>
                         </>
                    ) :
                        
                    ( <Nav.Link as={NavLink}   to ='/login' > 로그인</Nav.Link> )  
                        
                }
            </Navbar.Collapse>
        </Navbar>
    );
}

export default MenuBar;