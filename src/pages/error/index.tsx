import warningIcon from '../../assets/images/error 1.svg';

export default function ErrorPopUp(props: any) {
  return (
    <div className="mainContainer">
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        {props.buttonText}
      </button>
      <div className="modal fade" id="exampleModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ backgroundColor: "#212123" }}>
            <div className="modal-body text-center p-5">
              <img src={warningIcon} className="img-fluid" alt="" />
              <p
                className="font500 text-white mt-4"
                style={{ fontSize: "20px" }}
              >
                Opps...
              </p>
              <p
                className="font500"
                style={{ fontSize: "16px", color: "#959595" }}
              >
                Error: Http failure response for
                https://client-apis.oneream.com/services/v2/start_game:403
                FORBIDDEN
              </p>
              <div className="d-grid mt-4" data-bs-dismiss="modal">
                <button className="btn gradientBtn btn-lg border-0">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}