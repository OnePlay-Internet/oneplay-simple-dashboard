import * as React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../assets/css/sidebar.css';
import brandLogo from "../../assets/images/oneplayLogo.svg";
import defaultUser from "../../assets/images/user/defaultUser.svg"

export default function AuthLayout() {
  return( 
    <>
      <div className='container-fluid'>
        <div className="row">
          <div className="col-auto mt-4 sidebar text-center">
            <p className="mb-4">
              <NavLink
                to="/"
                className="text-decoration-none text-initial"
              >
                <img
                  className="card-img rounded-circle"
                  width="48px"
                  height="48px"
                  src={defaultUser}
                  alt=""
                />
              </NavLink>
            </p>
            <p>
              <NavLink
                to="/search"
                className="text-decoration-none text-initial"
              >
                <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
              </NavLink>
            </p>
            
            <p>
              <NavLink
                to="/all-games"
                className="text-decoration-none text-initial"
              >
                <i className="fa-solid fa-gamepad"></i>
              </NavLink>
            </p>
            <p>
              <NavLink
                to="/settings"
                className="text-decoration-none text-initial"
              >
                <i className="fa-solid fa-gear"></i>
              </NavLink>
            </p>
            <p>
              <NavLink
                to=""
                className="text-decoration-none text-initial"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </NavLink>
            </p>
            
          </div>
          <div className='col'>
            <div className='text-end px-3 pt-3 fixed-top'><img src={brandLogo} className='img-fluid' alt="" /></div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
