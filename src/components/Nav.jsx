import { Link } from 'react-router-dom'; //this is react "Link", must be used instead of 'link'
import "../css/index.css";
function Navigation(){
    return(
<aside className='sidebar-left'>
            <div className="sidebar-inner">
                <div id="logo">
                    <h2>Header</h2>
                </div>
                <div id="links">
                    <div className="link-container">
                        <Link to="/">Home</Link>
                    </div>
                    <div className="link-container">
                        <Link to="/student-management">Student Management</Link>
                    </div>
                    <div className="link-container">
                        <Link to="/payment">Payment</Link>
                    </div>
                    <div className="link-container">
                        <Link to="/about">About</Link>
                    </div>

                </div>


            </div>
        </aside>
    )
}
export default Navigation;


