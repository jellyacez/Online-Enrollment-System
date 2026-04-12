import { Link } from "react-router-dom"; //this is react "Link", must be used instead of 'link'
function Navigation() {
  return (
    <nav>
      <div id="logo"></div>
      <div id="links">
        <Link to="/">Home</Link>
        <Link to="/payment">Payment</Link>
        <Link to="/student-management">Student Management</Link>
      </div>
    </nav>
  );
}
export default Navigation;
