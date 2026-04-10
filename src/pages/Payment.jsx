import '../css/index.css';
import '../css/payment.css';
//https://brandfetch.com/gcash.com Gcash logo
export default function Payment(){
    return(
        <main>
            <div class="fees-tab">
            <ul>
                <li>Subjects enrolled -500</li>
            </ul>
            </div>
            <div class="payment-tab">
                <h1>Total Outstanding Balance: 12,000</h1>
                <span>Please choose mode of payment</span>
                <div class="paybtns">
                    <button class="paybtn"> <img src=" https://cdn.brandfetch.io/idU5cKFAqi/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1764364200213" alt="Gcash-log" /> 
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

