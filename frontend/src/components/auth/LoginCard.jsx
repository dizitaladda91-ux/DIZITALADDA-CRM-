import BrandMark from "../branding/BrandMark";
import LoginForm from "./LoginForm";
import "./auth.css";

const LoginCard = () => {
  return (
    <div className="auth-card">
      <div className="auth-card__inner">
        <div className="auth-card__logo">
          <BrandMark className="auth-card__mark" />
        </div>

        <div className="auth-card__title">
          <h1>Welcome back</h1>
          <p>Sign in to access your admission and learning workspace with confidence.</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginCard;
