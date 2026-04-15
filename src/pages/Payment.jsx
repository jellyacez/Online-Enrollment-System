import { useState } from "react";
import { Link } from 'react-router-dom';
import "../css/index.css";
import "../css/payment.css";

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [partialPayment, setPartialPayment] = useState("");
  const [modal, setModal] = useState(false);

  const handlePayment = () => {
    if (!selectedMethod) {
      setMessage({ text: "Please Select a payment method.", type: "error" });
      return;
    }
    if (!email) {
      setMessage({ text: "Email address is required to receive a receipt.", type: "error" });
      return;
    }
    if ((selectedMethod === "gcash" || selectedMethod === "maya" || selectedMethod === "gotyme") && !mobileNumber) {
      setMessage({ text: "Mobile number is required for this payment method.", type: "error" });
      return;
    }

    setModal(true);

    

   
  };

const confirmPayment = ()=>{
setModal(false)
   setTimeout(() => {
    

    setLoading(true);
    setMessage({ text: "Processing...", type: "info" });

      setLoading(false);
      setMessage({
        text: `Payment of ₱52,600.00 via ${selectedMethod.toUpperCase()} processed. Receipt sent to ${email}`,
        type: "success"
      });
    }, 2000);
}

const cancelModal = ()=>{
  setModal(false);
}


  const getMethodLabel = () => {
    const methods = { gcash: "Gcash", paypal: "Paypal", maya: "Maya", gotyme: "Gotyme Bank" };
    return methods[selectedMethod] || "None";
  };

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
                  <td>30,000.00</td>
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
          <strong>{getMethodLabel()}</strong>
        </div>
        
        <div className="paybtns">
          <button className="paybtn" id="gcash" onClick={() => setSelectedMethod("gcash")}>
            <img src="https://cdn.brandfetch.io/idU5cKFAqi/theme/dark/logo.svg" alt="Gcash-logo" />
            <span>Pay with Gcash</span>
          </button>

          <button className="paybtn" id="maya" onClick={() => setSelectedMethod("maya")}>
            <img src="https://cdn.brandfetch.io/idNZIam-Y9/w/200/h/200/theme/dark/icon.jpeg" alt="maya-logo" />
            <span>Pay with Maya</span>
          </button>

          <button className="paybtn" id="gotyme" onClick={() => setSelectedMethod("gotyme")}>
            <img src="https://cdn.brandfetch.io/idnIc2_J5Q/w/400/h/400/theme/dark/icon.jpeg" alt="GoTyme-logo" />
            <span>Pay with GoTyme Bank</span>
          </button>

          <button className="paybtn" id="paypal" onClick={() => setSelectedMethod("paypal")}>
            <img src="https://cdn.brandfetch.io/id-Wd4a4TS/theme/dark/id31tBizMM.svg" alt="Paypal-logo" />
            <span>Pay with PayPal</span>
          </button>

          <div className="payment">
            <input type="email" name="email" id=""
              placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />

            <input type="tel" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />

            <div className="partial-payment">
              <input type="number" step="0.1" name="number" placeholder="Pay partial amount (Optional)" value={partialPayment}
                onChange={(e) => setPartialPayment(e.target.value)}
              />
            </div>
          </div>

          <button className="confirm-btn" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : `Confirm Payment ₱52,600.00`}
          </button>
    
          {modal &&(
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Confirm Payment</h3>
                <p>Are you sure you want to proceed with the payment of ₱52,600.00</p>
                <p><strong>Payment Method:{getMethodLabel()}</strong></p>
                <p><strong>Email:</strong> {email}</p>
                {mobileNumber && <p><strong>Mobile:</strong> {mobileNumber}</p>}

                <div className="modal-btns">
                  <button onClick={confirmPayment} className="accept-pay">Confirm</button>
                  <button onClick={cancelModal} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {message.text && (
            <div className={`message-area ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="payment-footer">
            <Link to="/">← Cancel and return</Link>
            
          </div>
        </div>
      </div>
    </main>
  );
}