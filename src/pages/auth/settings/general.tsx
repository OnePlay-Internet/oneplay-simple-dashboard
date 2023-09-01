import InvoiceImg from '../../../assets/images/setting/Invoice.svg';
import MessageImg from '../../../assets/images/setting/Message.svg';
import NewsImg from '../../../assets/images/setting/News.svg';
import FileImg from '../../../assets/images/setting/File.svg';
import PrivacyImg from '../../../assets/images/setting/Privacy.svg';
import piechartImg from '../../../assets/images/setting/Pie_Chart.svg';
import deleteImg from '../../../assets/images/setting/Delete.svg';
import logoutImg from '../../../assets/images/setting/Logout.svg';
import arrow from '../../../assets/images/setting/Vector 67.svg';


export default function General() {
    return(
        <>
            <div className="row ps-5">
                <div className="col-lg-10">
                    <div className="row">
                        <div className="col-md-4 mt-4">
                            <div className="card border-0 cardBG">
                                <div className='card-body p-4'>
                                    <div className='row height151'>
                                        <div className='col'>
                                            <img src={InvoiceImg} className='img-fluid' alt="" />
                                            <p className='font20Text mt-2 mb-0'>Frequently Asked Questions</p>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-4 mt-4">
                            <div className="card border-0 cardBG">
                                <div className='card-body p-4'>
                                    <div className='row height151'>
                                        <div className='col'>
                                            <img src={MessageImg} className='img-fluid' alt="" />
                                            <p className='font20Text mt-2 mb-0'>Support</p>
                                        </div>
                                    </div> 
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-4 mt-4">
                            <div className="card border-0 cardBG">
                                <div className='card-body p-4'>
                                    <div className='row height151'>
                                        <div className='col'>
                                            <img src={NewsImg} className='img-fluid' alt="" />
                                            <p className='font20Text mt-2 mb-0'>Terms & Conditions</p>
                                        </div>
                                    </div> 
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-4 mt-4">
                            <div className="card border-0 cardBG">
                                <div className='card-body p-4'>
                                    <div className='row height151'>
                                        <div className='col'>
                                            <img src={FileImg} className='img-fluid' alt="" />
                                            <p className='font20Text mt-2 mb-0'>Privacy Policy</p>
                                        </div>
                                    </div> 
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-4 mt-4">
                            <div className="card border-0 cardBG">
                                <div className='card-body p-4'>
                                    <div className='row height151'>
                                        <div className='col'>
                                            <img src={PrivacyImg} className='img-fluid' alt="" />
                                            <p className='font20Text mt-2 mb-0'>Privacy</p>
                                        </div>
                                        <div className='col-auto mt-3'>
                                            <div className="form-check form-switch mt-4">
                                                <input className="form-check-input" type="checkbox" role="switch" />
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-4 mt-4">
                            <div className="card border-0 cardBG">
                                <div className='card-body p-4'>
                                    <div className='row height151'>
                                        <div className='col'>
                                            <img src={piechartImg} className='img-fluid' alt="" />
                                            <p className='font20Text mt-2 mb-0'>Session Data</p>
                                        </div>
                                        <div className='col-auto mt-2'>
                                            <img src={deleteImg} className='img-fluid mt-4' width="20px" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-4 mt-4">
                            <div className="card border-0 cardBG">
                                <div className='card-body p-4'>
                                    <div className='row height151'>
                                        <div className='col'>
                                            <img src={logoutImg} className='img-fluid' alt="" />
                                            <p className='font20Text mt-2 mb-0'>Log out</p>
                                        </div>
                                    </div> 
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-md-6 mt-5'>
                            <div className='row gamesDescription Customborder'>
                                <div className='col'>
                                    Visit <span className='gradientText'>www.oneplay.in</span> for more information.
                                </div>
                                <div className='col-auto'>
                                    <img src={arrow} className='img-fluid' alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}