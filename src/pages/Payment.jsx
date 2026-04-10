import '../css/index.css';
import '../css/payment.css';
//https://brandfetch.com/gcash.com Gcash logo
export default function Payment(){
    return(
        <main>
            <div className="fees-tab">
          <div id="studentInfoContainer">
            <div style={{textAlign:"center", padding:"1rem",fontSize:"1.35rem"}}>
                <h3>Student Information</h3>
            </div>
            <div className="student-info-con">
                <span className="studentInfo">Student ID: 000001</span>
                <span className="studentInfo">Name: Dwigth Louie Lagazon</span>
                <span className="studentInfo">Course: Bachelor of Information Technology</span>
                <span className="studentInfo">Year Level: 3rd Year</span>
            </div>
          </div>
          <div>
            <table>
                <thead>
            <tr>
                <th>Code</th>
                <th>Subject Title</th>
                <th>Unit</th>
                <th>Section</th>
            </tr>
            </thead>
            <tr>
                <td>SOCSCI 313</td>
                <td>Science, Technology, and Society</td>
                <td>3</td>
                <td>Info 3-C</td>
            </tr>
             <tr>
                <td>SOCSCI 313</td>
                <td>Science, Technology, and Society</td>
                <td>3</td>
                <td>Info 3-C</td>
            </tr>
             <tr>
                <td>SOCSCI 313</td>
                <td>Science, Technology, and Society</td>
                <td>3</td>
                <td>Info 3-C</td>
            </tr>
             <tr>
                <td>SOCSCI 313</td>
                <td>Science, Technology, and Society</td>
                <td>3</td>
                <td>Info 3-C</td>
            </tr>
             <tr>
                <td>SOCSCI 313</td>
                <td>Science, Technology, and Society</td>
                <td>3</td>
                <td>Info 3-C</td>
            </tr>
             <tr>
                <td>SOCSCI 313</td>
                <td>Science, Technology, and Society</td>
                <td>3</td>
                <td>Info 3-C</td>
            </tr>
             <tr>
                <td>SOCSCI 313</td>
                <td>Science, Technology, and Society</td>
                <td>3</td>
                <td>Info 3-C</td>
            </tr>
            </table>
            <div style={{display:"grid", gridTemplateColumns:"auto auto"}}>
                 <span>Total Subject/s: 7</span> <span>Total Unit(s):21</span>
            </div>
          </div>
          <div className="assessedFees">
            <div><h3>Assessed Fees</h3></div>
            <table>
                <tr>
                    <td>USC Fees</td>
                    <td>150.00</td>
                </tr>
                  
                <tr>
                    <td>Club Fees</td>
                    <td>200.00</td>
                </tr>

                  <tr>
                    <td>CCS Fees</td>
                    <td>150.00</td>
                </tr>
                  <tr>
                    <td>School ID Fees</td>
                    <td>50.00</td>
                </tr>
                  <tr>
                    <td>Registration Fees</td>
                    <td>150.00</td>
                </tr>

                  <tr>
                    <td>Guidance Fees</td>
                    <td>270.00</td>
                </tr>
                  <tr>
                    <td>Medical/Dental Fees</td>
                    <td>180.00</td>
                </tr>
                  <tr>
                    <td>Library Fees</td>
                    <td>300.00</td>
                </tr>
                  <tr>
                    <td>Labaratory Fees</td>
                    <td>1500.00</td>
                </tr>
                  <tr>
                    <td>Inusurance Fees</td>
                    <td>250.00</td>
                </tr>
                  <tr>
                    <td>Development Fees-IRSF</td>
                    <td>2800.00</td>
                </tr>
                  <tr>
                    <td>Computer Fees</td>
                    <td>550.00</td>
                </tr>
                  <tr>
                    <td>Cultural Fees</td>
                    <td>450.00</td>
                </tr>
                  <tr>
                    <td>Athletic Fees</td>
                    <td>350.00</td>
                </tr>
                <tr>
                    <td>Total Unit Fees</td>
                    <td>31,500.00</td>
                </tr>
                  <tr>
                    <td>Tuition Fees</td>
                    <td>21,500.00</td>
                </tr>
               <tr>Total:60,350.00</tr> 
            </table>
          </div>
            </div>
            <div className="payment-tab">
                <h1>Total Outstanding Balance: 12,000</h1>
                <span>Please choose mode of payment</span>
                <div className="paybtns">
                    <button className="paybtn"> <img src=" https://cdn.brandfetch.io/idU5cKFAqi/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1764364200213" alt="Gcash-log" /> 
                       <span>Pay with Gcash</span>
                    </button>

                    <button className="paybtn" onclick="">
                    <img src="https://cdn.brandfetch.io/idNZIam-Y9/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1671108646055" alt="maya-logo" />
                    <span>Pay with Maya</span>
                    </button>

                    <button className="paybtn">
                    <img src="https://cdn.brandfetch.io/idnIc2_J5Q/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1668014125659" alt="GoTyme-logo" />
                    <span>Pay with GoTyme Bank</span>
                    </button>

                    <button className="paybtn">
                    <img src="https://cdn.brandfetch.io/id-Wd4a4TS/theme/dark/id31tBizMM.svg?c=1bxid64Mup7aczewSAYMX&t=1727787879793" alt="Paypal-logo" />
                    <span>Pay with PayPal</span>
                    </button>
                </div>
            </div>
        </main>
    )
}

