import game1 from '../../assets/images/games/Group 169.svg';
import game2 from '../../assets/images/games/Rectangle 147 (1).svg';
import game3 from '../../assets/images/games/Rectangle 147.svg';

export default function Home() {
    return(
        <>
            <div className="container-fluid p-0">
                <div className="row pt-5">
                    <div className="col-lg-12 mt-3">
                        <div className="card border-0 transparentBg">
                            <div className="row">
                                <div className="col-auto width30">
                                    <div className="card border-0 transparentBg">
                                        <img src={game1} className="card-img height50vh rounded" alt="..." />
                                        <div className="card-img-overlay" style={{background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 58.85%, rgba(0, 0, 0, 0.52) 79.17%, rgba(0, 0, 0, 0.80) 100%)'}}>
                                            <div className="row height45vh align-items-center">
                                                <div className="col">
                                                    <img src="https://imagic.edge-net.co/magic/rs:fit:640:480:1/dpr:1/aHR0cHM6Ly9vbmVwbGF5LWFzc2V0cy5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vZ2FtZV9hc3NldHMvYmIyYmM0MjRjNjRmNTM0MDg2YWE1YmJjNDc5MTgyMGZhMzA1MzhhOGI1YTYxYWRmYTU0NTdlM2E5NGJiNGE0MS9pbWFnZXMvdGV4dF9sb2dvL2hvcml6b24temVyby1kYXduLWxvZ28ucG5n.webp" className="img-fluid text-logo" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto width40">
                                    <div className="card border-0 transparentBg">
                                        <img src={game2} className="card-img height50vh rounded" alt="..." />
                                        <div className="card-img-overlay" style={{background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 58.85%, rgba(0, 0, 0, 0.52) 79.17%, rgba(0, 0, 0, 0.80) 100%)'}}>
                                            <div className="row height45vh align-items-center">
                                                <div className="col">
                                                    <img src="https://imagic.edge-net.co/magic/rs:fit:640:480:1/dpr:1/aHR0cHM6Ly9vbmVwbGF5LWFzc2V0cy5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vZ2FtZV9hc3NldHMvZDVkOTg4ZmQxMDhmOGZlYTBiZjc5OTZiMzcyNTQzZDE5YTI5Y2RkY2ZhOTY3YTlkMTEzMThkYzVlMzRmNjAwNy9pbWFnZXMvdGV4dF9sb2dvL2JvcmRlcmxhbmRzLTMtbG9nby5wbmc.webp" className="img-fluid text-logo" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto width30">
                                    <div className="card border-0 transparentBg">
                                        <img src={game3} className="card-img height50vh rounded" alt="..." />
                                        <div className="card-img-overlay" style={{background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 58.85%, rgba(0, 0, 0, 0.52) 79.17%, rgba(0, 0, 0, 0.80) 100%)'}}>
                                            <div className="row height45vh align-items-center">
                                                <div className="col">
                                                    <img src="https://imagic.edge-net.co/magic/rs:fit:640:480:1/dpr:1/aHR0cHM6Ly9vbmVwbGF5LWFzc2V0cy5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vZ2FtZV9hc3NldHMvNmViMDIxMDA4YjlmNDRjN2RmMzQ5ZmNmM2U1MzM3MDc0MTFhNDExMzgyZmY5NDNlMGUyMDZhYzNkMTg0ZTYyZC9pbWFnZXMvdGV4dF9sb2dvL21vc3R3YW50ZWQucG5n.webp" className="img-fluid text-logo" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-img-overlay">
                                <div className="row height45vh align-items-end">
                                    <div className="col-auto width30"></div>
                                    <div className='col-auto width40 ps-4'>
                                        <button className='btn text-white gradientBtn border-0 br90 px-4 btn-lg fw600'>Play Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center pt-4">
                    <div className="col-auto">
                        <div className="row justify-content-center scrolltab">
                            <div className="col-auto tabOptions">
                                <a href="javascript:void(0)" className="card bgColor text-decoration-none activeBG">
                                    <div className="customBtnPadding bgColor">For You</div>
                                </a>
                            </div>
                            <div className="col-auto tabOptions">
                                <a href="javascript:void(0)" className="card bgColor text-decoration-none mutedColor">
                                    <div className="customBtnPadding bgColor">RPG</div>
                                </a>
                            </div>
                            <div className="col-auto tabOptions">
                                <a href="javascript:void(0)" className="card bgColor text-decoration-none mutedColor">
                                    <div className="customBtnPadding bgColor">Shooter</div>
                                </a>
                            </div>
                            <div className="col-auto tabOptions">
                                <a href="javascript:void(0)" className="card bgColor text-decoration-none mutedColor">
                                    <div className="customBtnPadding bgColor">Multiplayer</div>
                                </a>
                            </div>
                            <div className="col-auto tabOptions">
                                <a href="javascript:void(0)" className="card bgColor text-decoration-none mutedColor">
                                    <div className="customBtnPadding bgColor">Co-op</div>
                                </a>
                            </div>
                            <div className="col-auto tabOptions">
                                <a href="javascript:void(0)" className="card bgColor text-decoration-none mutedColor">
                                    <div className="customBtnPadding bgColor">Indie</div>
                                </a>
                            </div>
                            <div className="col-auto tabOptions">
                                <a href="javascript:void(0)" className="card bgColor text-decoration-none mutedColor">
                                    <div className="customBtnPadding bgColor">Racing</div>
                                </a>
                            </div>  
                        </div>
                    </div>
                </div>
                <div className="row pt-4 ms-5 ps-2">
                    <div className="col-12">
                        <p className="heading">Free to Play</p>
                    </div>  
                    <div className="row scrolltab mb-5">
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game1} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game2} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game3} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game1} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game2} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game1} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game2} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game3} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game1} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="fixedWidth tabOptions" style={{ padding: "10px", borderRadius: "10px" }}>
                            <img src={game2} className="img-fluid rounded coverImg" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}