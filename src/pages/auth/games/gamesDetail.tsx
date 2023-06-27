import brandLogo from '../../../assets/images/oneplayLogo.svg';
import Games from '../../../assets/images/games/Rectangle 210.svg';
import Store from '../../../assets/images/store/steam.png';
import { NavLink } from 'react-router-dom';

export default function GamesDetail() {
    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><img src={brandLogo} className="img-fluid" alt="logo" /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/all-games" className="nav-link">All Games</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container-fluid bg-dark">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card border-0">
                            <img
                                className="card-img banner"
                                src={Games}
                                alt="games"
                            />
                            <div className="card-img-overlay customOverlay p-lg-4 pl-lg-5"> 
                                <div className="row h-100">
                                    <div className="col-md-12 align-self-end">
                                        <p className='text-white fw-bold'>July, 2019  - Everyone</p>
                                        <button
                                        className="btn btnGradient px-4"
                                        
                                        >Play Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-3 mt-md-4">
                        <h3 className="text-white">About Game</h3>
                        <p className='textOffWhite font500'>
                            One Play collects information about You when you create a User Account, purchase a Subscription and/or use our Service. Our Privacy Policy applies to all Users who use our Service.
                            Terms used with
                            <span className='text-white'>...Read more</span>
                        </p>
                    </div>
                    <div className="col-md-6">
                        <div
                            className="col-auto pr-lg-5 mt-4"
                        >
                            <p className="font500 text-white">Store</p>
                            <a
                            href="javascript:void(0)"
                            className="font600 font20 text-white p-2 pr-3 store selected"
                            >
                                <img
                                    src={Store}
                                    height="32"
                                    className="me-2"
                                    alt=""
                                />
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}