import games from '../../../assets/images/games/Rectangle 210.svg'

export default function SearchGames() {
    return(
        <>
            <div className="row">
                <div className="col-md-3 pt-5">
                    <input type="search" className="form-control inputControl" placeholder="Search"/>
                    <p className="smallText mt-5">search suggestions</p>
                    <div className="row">
                        <div className="col-12">
                            <p className="suggestionResult">Call of Duty 3</p>
                            <p className="suggestionResult active">Modern Warfare</p>
                            <p className="suggestionResult">Black Ops III</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-9 paddingTop90">
                    <p className="heading">Popular Games</p>
                    <div className="row">
                        <div className="col-md-3 mt-3">
                            <img src={games} width="336px" height="189px" className="img-fluid rounded" alt="" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="col-md-3 mt-3">
                            <img src={games} width="336px" height="189px" className="img-fluid rounded" alt="" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="col-md-3 mt-3">
                            <img src={games} width="336px" height="189px" className="img-fluid rounded" alt="" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="col-md-3 mt-3">
                            <img src={games} width="336px" height="189px" className="img-fluid rounded" alt="" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                        <div className="col-md-3 mt-3">
                            <img src={games} width="336px" height="189px" className="img-fluid rounded" alt="" />
                            <p className="GamesTitle mb-0 mt-3">Forza Horizon 5</p>
                            <p className="gamesDescription">Racing, Co-Op, Multiplayer</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}