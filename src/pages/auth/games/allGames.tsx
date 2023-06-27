import brandLogo from '../../../assets/images/oneplayLogo.svg';
import Games from '../../../assets/images/games/Rectangle 210.svg';
import { NavLink } from 'react-router-dom';

export default function AllGames() {
    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/"><img src={brandLogo} className="img-fluid" alt="logo" /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/all-games" className="nav-link active">All Games</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container-fluid bg-dark pb-4">
                <div className="row">
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-6 col-6 mt-3">
                        <NavLink to="/games-detail" className="text-decoration-none text-initial">
                            <img src={Games} className="img-fluid rounded w-100" alt="games"/>
                            <h5 className="mt-3 mb-1 text-white">Forza Horizon 5</h5>
                            <p className="textOffWhite">Racing, Co-Op, Multiplayer</p>
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
}