import Clock from '../../../assets/images/setting/Alarm.svg'

export default function Subscription() {
    return(
        <>
            <div className="row paddingTop90">
                <div className="col-lg-9 col-md-11 ps-4">
                    <p className="GamesTitle">Current Subscription</p>
                    <div className="card cardBG border-0">
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <p className="gamesDescription mb-0">Weekly</p>
                                    <h1 className="price">$8.99</h1>
                                    <img src={Clock} className="img-fluid me-2" alt="" /><span className="smallText">10 hours left .</span><span className="gamesDescription">Expires on 16th Sep 2022</span>
                                </div>
                                <div className="col-auto align-self-center">
                                    <button className="btn gradientBtn px-4 border-0">Renew</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="GamesTitle mt-4">Subscription History</p>
                    <div className="table-responsive">
                        <table className="table table-dark align-middle customTable table-lg">
                            <thead>
                                <tr>
                                    <th>Date of Purchase</th>
                                    <th>Subscription Type</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>12.10.2022</td>
                                    <td>
                                        <p className="mb-1">Starter Edition</p>
                                        <p className="mb-0 gamesDescription">Weekly - 15 Hours</p>
                                    </td>
                                    <td>$8.99</td>
                                    <td className="gradientText">Current</td>
                                </tr>
                                <tr>
                                    <td>12.10.2022</td>
                                    <td>
                                        <p className="mb-1">Starter Edition</p>
                                        <p className="mb-0 gamesDescription">Weekly - 15 Hours</p>
                                    </td>
                                    <td>$8.99</td>
                                    <td>Completed</td>
                                </tr>
                                <tr>
                                    <td>12.10.2022</td>
                                    <td>
                                        <p className="mb-1">Starter Edition</p>
                                        <p className="mb-0 gamesDescription">Weekly - 15 Hours</p>
                                    </td>
                                    <td>$8.99</td>
                                    <td>Completed</td>
                                </tr>
                                <tr>
                                    <td>12.10.2022</td>
                                    <td>
                                        <p className="mb-1">Starter Edition</p>
                                        <p className="mb-0 gamesDescription">Weekly - 15 Hours</p>
                                    </td>
                                    <td>$8.99</td>
                                    <td className="cancelgradientText">Cancelled</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}