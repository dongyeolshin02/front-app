import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useNavigate } from 'react-router';
import { authStore } from '../store/authStore';
import { NavDropdown } from 'react-bootstrap';

function MenuBar(props) {

      const { isAuthenticated, clearAuth, getUserRole } = authStore();
      const userName = authStore((s) => s.userName);
        const navigate = useNavigate(); 
      const handleLogout = () =>{
        clearAuth();
        navigate('/login');
      }

    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/board" className={ ({isActive})=> isActive ? 'active' : ''}>게시판</Nav.Link>
                <Nav.Link as={NavLink} to="/gal"   className={ ({isActive})=> isActive ? 'active' : ''}>이미지게시판</Nav.Link>
                </Nav>
                {isAuthenticated() && getUserRole() ==='ROLE_ADMIN' && (
                        <Nav.Link 
                            as={NavLink} 
                            to="/admin" 
                            className={({isActive}) => isActive ? 'active' : ''}
                        >
                            관리자페이지
                        </Nav.Link>
                    )}
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  { isAuthenticated() ? (
                    <>
                        <NavDropdown title={userName} id="navbarScrollingDropdown">
                        <NavDropdown.Item href="#action3">회원정보</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleLogout}>
                            로그아웃
                        </NavDropdown.Item>
                       
                        </NavDropdown>
                    </>
                  )
                  : '' }
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MenuBar;