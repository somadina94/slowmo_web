import { Link } from "react-router-dom";
import { MoonMark } from "./MoonMark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{ color: "var(--cream)", fontSize: 32 }}>
              <MoonMark /> slow mo<sup>™</sup>
            </div>
            <p>Plant wisdom for a slower, brighter you. Ayurvedic proprietary medicine. Prescription use only.</p>
            <div className="mt-6 flex gap-2">
              <div className="tag" style={{ background: "rgba(246,242,232,0.1)", color: "var(--cream)" }}>
                Made in India
              </div>
              <div className="tag" style={{ background: "rgba(246,242,232,0.1)", color: "var(--cream)" }}>
                Ayush licensed
              </div>
            </div>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li>
                <Link to="/preorder">Preorder</Link>
              </li>
              <li>
                <Link to="/account">Track order</Link>
              </li>
              <li>
                <a href="#how">Refill program</a>
              </li>
              <li>
                <a href="#product">Bundles</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li>
                <a href="#benefits">About</a>
              </li>
              <li>
                <a href="#science">Science</a>
              </li>
              <li>
                <a href="#faq">Journal</a>
              </li>
              <li>
                <a href="mailto:hello@slowmo.co">Careers</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <Link to="/preorder">Consult a doctor</Link>
              </li>
              <li>
                <a href="mailto:hello@slowmo.co">Contact</a>
              </li>
              <li>
                <a href="mailto:hello@slowmo.co">hello@slowmo.co</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Slow Mo Wellness Pvt Ltd. All rights reserved.</span>
          <span>Ayurvedic proprietary medicine · License #AYUSH-KA-24-0912 · Prescription required</span>
        </div>
      </div>
    </footer>
  );
}
