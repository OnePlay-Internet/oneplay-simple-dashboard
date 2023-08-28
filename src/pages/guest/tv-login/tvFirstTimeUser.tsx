import brandLogo from "../../../assets/images/oneplayLogo.svg";
import qrImg from "../../../assets/images/tv/qr-img.svg";

export default function TvFirstTimeUser() {
    return(
        <>
            <div className="container-fluid backgroundBgGradient">
                <div className="pt-4 position-fixed end-0">
                    <img src={brandLogo} className="img-fluid pe-3" alt="" />
                </div>
                <div className="container">
                    <div className="row middleAlign">
                        <div className="col-lg-6 mt-5 text-center">
                            <h2 className="price mb-5">Existing User</h2>
                            <p className="font20Text mb-0">Welcome back, <br/>Please Login to continue using Onplay Services.</p>
                            <div className="mt-5">
                                <button className="btn btn-lg px-5 border-0 customLinearGradient customBtn text-white">Log in</button>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-5 text-center borderLeft2">
                            <h2 className="price mb-5">Create a New Account</h2>
                            <p className="font20Text mb-0">Scan the QR code with your Phone’s camera or go to:</p>
                            <h3 className="heading">oneplay.in/register</h3>
                            <div className="mt-5">
                                <img src={qrImg} className="img-fluid" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}