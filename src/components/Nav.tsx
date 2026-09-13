import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import { Icon } from "./icons";
import { MoonMark } from "./MoonMark";

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Nav() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <MoonMark /> slow mo<sup>™</sup>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link" onClick={() => setTimeout(() => scrollToId("product"), 50)}>
            The product
          </Link>
          <Link to="/" className="nav-link" onClick={() => setTimeout(() => scrollToId("science"), 50)}>
            Science
          </Link>
          <Link to="/" className="nav-link" onClick={() => setTimeout(() => scrollToId("how"), 50)}>
            How it works
          </Link>
          <Link to="/" className="nav-link" onClick={() => setTimeout(() => scrollToId("faq"), 50)}>
            FAQ
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to={user.role === "customer" ? "/account" : "/admin"} className="nav-link">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => navigate(user ? "/preorder" : "/login")}>
            Preorder — ₹3,390 <Icon.ArrowRight />
          </button>
        </div>
      </div>
    </nav>
  );
}
