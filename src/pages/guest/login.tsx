export default function Login() {
    return(
        <>
            <div className="container-fluid bg">
                <div className="row justify-content-center align-items-center vh-100">
                    <div className="col-md-6 col-lg-3">
                        <div className="card bg-dark">
                            <div className="card-body text-white p-4">
                                <h3 className="fw-bold text-center"><u>Login</u></h3>
                                <label className="mt-3">Email / Phone</label>
                                <input type="text" className="form-control" />
                                <label className="mt-3">Password</label>
                                <input type="password" className="form-control" />
                                <div className="d-grid mt-4">
                                    <button className="btn btnGradient">Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}