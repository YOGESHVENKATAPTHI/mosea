import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #181c24 60%, #232a3a 100%);
  padding: 1.5rem 3vw 1.5rem 2vw;
  box-shadow: 0 2px 8px #0004;
`;

const Logo = styled(Link)`
  font-size: 2.2rem;
  font-weight: bold;
  color: #e50914;
  letter-spacing: 2px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  font-size: 1.2rem;
  color: #e5e5e5;
  font-weight: 500;
  transition: color 0.2s;
  &:hover {
    color: #e50914;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.1rem;
  color: #e5e5e5;
`;

const LogoutBtn = styled.button`
  background: none;
  border: none;
  color: #e50914;
  font-size: 1.3rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: color 0.2s;
  &:hover {
    color: #fff;
  }
`;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Logo to="/">Movto</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
      </Nav>
      <Profile>
        <FaUserCircle size={28} />
        {user?.username}
        <LogoutBtn
          title="Logout"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <FaSignOutAlt />
        </LogoutBtn>
      </Profile>
    </HeaderWrapper>
  );
};

export default Header; 