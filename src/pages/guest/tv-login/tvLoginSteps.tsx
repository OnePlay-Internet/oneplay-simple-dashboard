import brandLogo from "../../../assets/images/oneplayLogo.svg";
import qrImg from "../../../assets/images/tv/qr-img.svg";

export default function TvLogin() {
    return(
        <>
            <div className="container-fluid backgroundBg">
                <div className="pt-4 position-fixed end-0">
                    <img src={brandLogo} className="img-fluid pe-3" alt="" />
                </div>
                <div className="container">
                    <div className="row justify-content-center middleAlign">
                        <div className="col-lg-9 pt-5">
                            <div className="row">
                                <div className="col-lg-9">
                                    <h2 className="price">Follow these steps on your computer or mobile device</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-9 mt-4">
                                    <div className="row mt-5">
                                        <div className="col-auto">
                                            <div className="countStep">1</div>
                                        </div>
                                        <div className="col">
                                            <p className="font20Text mb-0">Scan the QR code with your Phone’s camera or go to:</p>
                                            <h3 className="heading">oneream.com/tv</h3>
                                        </div>
                                    </div>
                                    <div className="row mt-5">
                                        <div className="col-auto">
                                            <div className="countStep">2</div>
                                        </div>
                                        <div className="col">
                                            <p className="font20Text mb-0">Enter sign-in code:</p>
                                            <h3 className="heading">1597-7158</h3>
                                        </div>
                                    </div>
                                    <div className="row mt-5">
                                        <div className="col-auto">
                                            <div className="countStep">3</div>
                                        </div>
                                        <div className="col align-self-center">
                                            <p className="font20Text mb-0">Sign in to Oneplay. Your TV will be ready to watch!</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 mt-4">
                                    <div className="mt-5">
                                        <img src={qrImg} className="img-fluid" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </>
    )
}