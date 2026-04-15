import { useState } from "react";
import "../css/index.css";
import "../css/payment.css";

// https://brandfetch.com/gcash.com Gcash logo


export default function Payment() {
  const [selectedMethod, setSelectedMethod]= useState(null);
  const [messege, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading,setloading] = useState("");

  if(!selectedMethod){
    setMessage ({text:"Please Select a payment method.",type:"error"});
    }
  if(!email){
    setMessage({text:"Email address is required to recieve a receipt.",type:"error"});
  }
  if((selectedMethod === "gcash" || selectedMethod === "maya" || selectedMethod === "gotyme") && !mobileNumber)

    setloading(true)
    setMessage({text:"Prcoessing...",type:"Info"})
    

    setTimeout(()=>{
      setloading(false)
      setMessage({
        text:`Payment of ₱52,600.00 via ${selectedMethod.toUpperCase()} processed. Reciept sent to ${email}`
      });
    },2000);

    const getMethodLabel = ()=> {
      const methods = {gcash:"Gcash",paypal:"Paypal",maya:"Maya",gotyme:"Gotyme Bank"};
      return methods(selectedMethod) || none;
    }

  return (
    <main className="main-containers">
      <div className="generalInfo">
        <div id="studentContainer">
          <h4>Student Info</h4>

          <div id="studentInfo">
            <span>Student Id: 000001</span>
            <span>Name: Luigi John B. Dandan</span>
            <span>Course: Bachelor of Information Technology</span>
            <span>Year: 3rd Year</span>
          </div>

          <div className="studentSubject-container">
            <h4>Student Subjects</h4>

            <table className="student-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Title</th>
                  <th>Unit</th>
                  <th>Section</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SOCSCI 313</td>
                  <td>Science, Technology, and Society</td>
                  <td>3</td>
                  <td>Info 3-C</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="fees-container">
          <h4>Assessed Fees</h4>

          <div id="table-container">
            <table>
              <thead>
                <tr>
                  <th>Fees</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <details>
                      <summary>Misc & Service</summary>

                      <div className="info-row"><span>USC Fee</span><span>PHP150.00</span></div>
                      <div className="info-row"><span>Club Fee</span><span>PHP150.00</span></div>
                      <div className="info-row"><span>School Id Fee</span><span>PHP150.00</span></div>
                      <div className="info-row"><span>Guidance Fee</span><span>PHP150.00</span></div>
                      <div className="info-row"><span>Insurance Fee</span><span>PHP150.00</span></div>
                      <div className="info-row"><span>Development Fees</span><span>PHP150.00</span></div>
                    </details>
                  </td>
                  <td>1600</td>
                </tr>

                <tr>
                  <td>Units Fee</td>
                  <td>30,000.000</td>
                </tr>

                <tr>
                  <td>Tuition Fee</td>
                  <td>21,000.00</td>
                </tr>
              </tbody>
            </table>

            <div id="total-fee">
              <span>Total Fee:</span>
              <span>52,600.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-tab">
        <div className="payment-header">
          <h2>Payment Summary</h2>
          <p>Review of Charges</p>
        </div>
        <div className="summary-payment">
          <span>Total Outstanding Balance:</span>
          <span>₱52,600.00</span>
        </div>

        <div className="summary-payment">
          <span>Less Partial Payment:</span>
          <span>₱0.00</span>
        </div>

        <div className="summary-payment">
          <span>Payment Due:</span>
          <span>₱52,600.00</span>
        </div>

        <div className="summary-payment">
          <span>Due Date:</span>
          <span>May 13, 2026</span>
        </div>

        <div className="summary-payment">
          <span>There will be a penalty of ₱500.00 per day if payment were late.</span>
        </div>

        <div className="Selected-btn">
        <span>Selected Method:</span>
        <strong>{getMethodLabel}</strong>
        </div>
        <div className="paybtns">
          <button className="paybtn" id="gcash" onClick={setSelectedMethod("gotyme")}>
            <img src="https://cdn.brandfetch.io/idU5cKFAqi/theme/dark/logo.svg" alt="Gcash-logo" />
            <span>Pay with Gcash</span>
          </button>

          <button className="paybtn" id="maya" onClick={setSelectedMethod("maya")}>
            <img src="https://cdn.brandfetch.io/idNZIam-Y9/w/200/h/200/theme/dark/icon.jpeg" alt="maya-logo" />
            <span>Pay with Maya</span>
          </button>

          <button className="paybtn" id="gotyme" onClick={setSelectedMethod("gotyme")}>
            <img src="https://cdn.brandfetch.io/idnIc2_J5Q/w/400/h/400/th eme/dark/icon.jpeg" alt="GoTyme-logo" />
            <span>Pay with GoTyme Bank</span>
          </button>

          <button className="paybtn" id="paypal" onclickk={setSelectedMethod("paypal")}>
            <img src="https://cdn.brandfetch.io/id-Wd4a4TS/theme/dark/id31tBizMM.svg" alt="Paypal-logo" />
            <span>Pay with PayPal</span>
          </button>
        </div>
      </div>
    </main>
  );
}