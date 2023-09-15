import ContactHeroImage from '../../../assets/images/setting/contact/Contact1.png';
import DashboardImage from '../../../assets/images/setting/contact/laptop1.png';

export default function Support() {
    return(
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className="row px-5 mb-5">
                        <div className="col-lg-6 col-md-6 align-self-center pe-lg-5">
                            <h1 className="text-white font50 font800" data-i18n-key="heading1">
                                Your voice matters
                            </h1>
                            <div className="row">
                                <div className="col-lg-9">
                                    <p className="font20Text font500 offWhiteColor mt-4 me-lg-4" data-i18n-key="subheading1">
                                        We are always here to listen. Let’s enhance 
                                        our community together.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 text-end desktopView">
                            <div className="row justify-content-end negativeMargin">
                                <div className="col-md-10">
                                    <img src={ContactHeroImage} className="img-fluid" alt="vector" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col p-0">
                        <hr className="border-bottom customBorderColor"/>
                    </div>
                </div>
            </div>

            <div className="container pt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-9">
                        <div className="row text-center justify-content-center mb-4">
                            <div className="col-12">
                                <h1 className="text-white font50 font800" data-i18n-key="heading2">
                                    Need help with OnePlay?
                                </h1>
                            </div>
                            <div className="col-lg-6 col-md-7">
                                <p className="font20Text font500 offWhiteColor mt-4 mb-0">
                                    Please provide your information to help us contact you
                                </p>
                            </div>
                        </div>
                        {/* <form>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 mt-5 inputMarginTop">
                                    <input type="text" className="form-control h56 borderRadius10 offWhiteColor bgTransparent inputFocus font20 font500" name="name" placeholder="Name" />
                                </div>
                                <div className="col-lg-6 col-md-6 mt-5 inputMarginTop">
                                    <input type="text" className="form-control h56 borderRadius10 offWhiteColor bgTransparent inputFocus font20 font500" name="EmailPhone" placeholder="Email or Phone" />
                                </div>
                                <div className="col-lg-12 mt-5 inputMarginTop">
                                    <input type="text" className="form-control h56 borderRadius10 offWhiteColor bgTransparent inputFocus font20 font500" name="Subject" placeholder="Subject" />
                                </div>
                                <div className="col-lg-12 mt-5 inputMarginTop">
                                    <textarea className="form-control borderRadius10 offWhiteColor bgTransparent inputFocus font20 font500" name="Message" placeholder="Message"></textarea>
                                </div>
                                <div className="col-lg-12 mt-5 text-end inputMarginTop centerTextResponsive">
                                    <input type="submit" className="btn text-nowrap  border-top-0 border-start-0 border-end-0 font18 text-white height48 ps-4 pe-4 font500 removeFocus linearGradient align-middle borderRadius60" value="Send your message" />
                                </div>
                            </div>
                        </form> */}
                        {/* This code for Loader */}
                        {/* <div className="row justify-content-center">
                            <div className="col-auto negativeWidthMargin">
                                <div className="formLoader mt-5"></div>
                            </div>
                        </div> */}

                        <div id="zsfeedbackwidgetdiv"></div>
                        
                        <div className="row pt-4 justify-content-center">
                            <div className="col-lg-7 col-md-8">
                                <div className="row">
                                    <div className="col align-self-center">
                                        <div className="customBorderColor border-bottom"></div>
                                    </div>
                                    <div className="col-auto align-self-center px-0">
                                        <span className="font16 font500 customOffWhite">OR</span>
                                    </div>
                                    <div className="col align-self-center">
                                        <div className="customBorderColor border-bottom"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col text-center mt-5 gradientAnchor">
                                <h3 className="font28 font700 text-white" data-i18n-key="dropemail">Drop us an email</h3>
                                <p className="font20 font500 mb-0"><a href="mailto:support@oneplay.in" id="emailId" data-i18n-key="emailaddress">support@oneplay.in</a><i className="fa-solid fa-copy cursorPointer font20 font500 text-white ms-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy"></i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid padding100">
                <div className="row">
                    <div className="col p-0">
                        <hr className="border-bottom customBorderColor"/>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row px-5 mt-5">
                    <div className="col-md-12">
                        <div className="card borderRadius30 linearGradient border-0">
                            <div className="card-body text-white pe-lg-0 ps-lg-5">
                                <div className="row">
                                    <div className="col-lg-9 ps-lg-4 pt-4 pb-4 align-self-center p-0">
                                        <h1 className="font50 font800">
                                            Be part of the Revolution by joining Discord channel and stay updated.
                                        </h1>
                                        <a href="https://discord.com/invite/Cg4ZskStE2" className="btn btn-lg align-middle font20Text text-white ps-5 pe-5 font500 removeFocus buttonLinear align-middle borderRadius60 border-top-0 border-start-0 border-end-0 mt-4"><i className="fa-brands fa-discord me-2 font20 align-middle"></i>Join Discord</a>
                                        <a href="#" className="btn text-nowrap mt-4 text-white font22 font500 align-middle ms-lg-4"><u data-i18n-key="btn text-nowrap -browsePlans">Browse Plans</u></a>
                                    </div>
                                    <div className="col-lg-3 align-self-center p-0">
                                        <div className="position-absoulte mr-130">
                                            <img src={DashboardImage} className="img-fluid" alt="laptop" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}