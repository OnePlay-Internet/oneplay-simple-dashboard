import { NavLink } from "react-router-dom";

export default function DeviceHistory() {
    return(
        <>
            <div className="row ps-4">
                <div className="col-lg-8 col-md-9">
                    <div className="row">
                        <div className="col">
                            <p className="GamesTitle mt-4">Device Hostory</p>
                        </div>
                        <div className="col-auto">
                            <button className="btn btnGarident">Logout from all devices</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dark align-middle customTable table-lg">
                            <thead>
                                <tr>
                                    <th className="py-3 px-0">Device</th>
                                    <th className="py-3 px-0">Location</th>
                                    <th className="py-3 px-0">Activity</th>
                                    <th className="py-3 px-0">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-3 px-0">
                                        <p className="mb-2">Chrome</p>
                                        <p className="gamesDescription mb-0">WebView</p>
                                    </td>
                                    <td className="py-3 px-0">
                                        <p className="mb-2">Mumbai</p>
                                        <p className="gamesDescription mb-0">India</p>
                                    </td>
                                    <td className="py-3 px-0"><p className="mb-0">3 days ago</p></td>
                                    <td className="py-3 px-0">
                                        <NavLink to="" className="gradientText">
                                            Log out
                                        </NavLink>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-0">
                                        <p className="mb-2">Chrome</p>
                                        <p className="gamesDescription mb-0">WebView</p>
                                    </td>
                                    <td className="py-3 px-0">
                                        <p className="mb-2">Mumbai</p>
                                        <p className="gamesDescription mb-0">India</p>
                                    </td>
                                    <td className="py-3 px-0"><p className="infoGradientText mb-0">Active Now</p></td>
                                    <td className="py-3 px-0">
                                        <NavLink to="" className="gradientText">
                                            Log out
                                        </NavLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}