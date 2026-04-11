import '../css/index.css';
import '../css/payment.css';
//https://brandfetch.com/gcash.com Gcash logo
export default function Payment(){
    return(
        <main>
           <div className='generalInfo'>
            <div id="studentContainer">
                <div>
                    <h4>Student Info</h4>
                </div>

                <div id="studentInfo">
                    <span>Student Id: 000001</span>
                    <span>Name: Dwigth Louie P. Lagazon</span>
                    <span>Course: Bachelor of Information Technology</span>
                    <span>Year: 3rd Year</span>
                </div>

           <div className='studentSubject'>
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
                </div>
            </div>
            <div id="feesContainer">
                <div>
                    <h4>Assessed Fees</h4>
                    </div>
                    <div id="tableContainer">
                <table>
                    <thead>
                        <tr>
                            <th>Fees</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tr>
                        <td>
                        <details>
                            <summary>
                                <span>Misc & Service</span>
                                <span>1600</span>
                            </summary>
                            <div className='info-row'>
                                <span>USC Fee</span>
                                <span>PHP150.00</span>
                            </div>
                             <div className='info-row'>
                                <span>Club Fee</span>
                                <span>PHP150.00</span>
                            </div>
                             <div className='info-row'>
                                <span>School Id Fee</span>
                                <span>PHP150.00</span>
                            </div>
                             <div className='info-row'>
                                <span>Guidance Fee</span>
                                <span>PHP150.00</span>
                            </div>
                             <div className='info-row'>
                                <span>Insurance Fee</span>
                                <span>PHP150.00</span>
                            </div>
                             <div className='info-row'>
                                <span>Development Fees</span>
                                <span>PHP150.00</span>
                            </div>
                        </details>
                        </td>
                    </tr>
                    <tr>
                        <td>Units Fee</td>
                        <td>30,000.000</td>
                    </tr>
                    <tr>
                        <td>Tuition Fee</td>
                        <td>21,000.00</td>
                    </tr>
                </table>
                     
                <div id="totalFee">
                <span>Total Fee: </span>
                <span>33,600.00</span>
                </div>
                     </div>
            </div>
           </div>
            <div className="payment-tab">
                <h1>Total Outstanding Balance: 52,600.00</h1>
                <span>Please choose mode of payment</span>
                <div className="paybtns">
                    <button className="paybtn" id="gcash"> <img src=" https://cdn.brandfetch.io/idU5cKFAqi/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1764364200213" alt="Gcash-log" /> 
                       <span>Pay with Gcash</span>
                    </button>

                    <button className="paybtn" id="maya" onclick="">
                    <img src="https://cdn.brandfetch.io/idNZIam-Y9/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1671108646055" alt="maya-logo" />
                    <span>Pay with Maya</span>
                    </button>

                    <button className="paybtn" id="tyme">
                    <img src="https://cdn.brandfetch.io/idnIc2_J5Q/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1668014125659" alt="GoTyme-logo" />
                    <span>Pay with GoTyme Bank</span>
                    </button>

                    <button className="paybtn" id="paypal">
                    <img src="https://cdn.brandfetch.io/id-Wd4a4TS/theme/dark/id31tBizMM.svg?c=1bxid64Mup7aczewSAYMX&t=1727787879793" alt="Paypal-logo" />
                    <span>Pay with PayPal</span>
                    </button>
                </div>
            </div>
        </main>
    )
}

