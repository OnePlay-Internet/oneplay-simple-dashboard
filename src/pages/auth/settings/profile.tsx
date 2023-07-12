import defaultUser from "../../../assets/images/user/defaultUser.svg"

export default function Profile() {
    return(
        <>
            <div className="row paddingTop90">
                <div className="col-lg-6 col-md-9 ps-4">
                    <p className="GamesTitle">Profile Settings</p>
                    <form>
                        <div className="row mt-2">
                            <div className="col-auto">
                                <input
                                    type="file"
                                    className="d-none"
                                    id="editProfile"
                                />
                                <label htmlFor="editProfile" className="d-flex mb-0">
                                    <div className="card transparentBg cursorPointer profile-image">
                                        <img
                                            className="card-img rounded-circle"
                                            width="48px"
                                            height="48px"
                                            src={defaultUser}
                                            alt=""
                                        />
                                        <div className="card-img-overlay transparentBlackBg ps-3 pt-2">
                                            <i className="fas fa-pen-fancy text-white mt-2"></i>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="col align-self-center ps-0">
                                <div className="align-middle gamesDescription">
                                    Edit profile picture.
                                </div>
                            </div>
                            <div className="col-12 mt-4">
                                <label className="smallText">Username</label>
                                <input type="text" className="form-control form-control-lg inputType mt-2" placeholder="username"/>
                            </div>
                            <div className="col-12 mt-4">
                                <label className="smallText">Full Name</label>
                                <input type="text" className="form-control form-control-lg inputType mt-2" placeholder="Full Name"/>
                            </div>
                            <div className="col-12 mt-4">
                                <label className="smallText">Bio</label>
                                <input type="text" className="form-control form-control-lg inputType mt-2" placeholder="Write a short bio in under 300 characters"/>
                            </div>
                            <div className="col-12 mt-5 text-end">
                                <input type="submit" className="btn btn-lg btnGarident border-0" value="Save Changes"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}