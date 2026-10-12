import { useState } from "react";
import { Link,  } from "react-router";
import axios from "axios";

export default function Login() {


  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
  
    const form = new FormData(event.target);

     axios
      .post(`${import.meta.env.VITE_API_URL}login.php`, {
        email: form.get("email"),
        password: form.get("password")
      })
      .then((response) => {
          if (response.data.status == false) {
            setMessage("Invalid email or password.");
            setMessageType('danger')
          } else {
            localStorage.setItem("access_token", response.data.jwt);
            localStorage.setItem("userdata", response.data.data);
            window.location.href = './dashboard';
          }
      })
      .catch(() => {
        setMessage("An error occurred while creating your account. Please try again.");
      });
  }

  return (
  <div className="container-scroller">
    <div className="container-fluid page-body-wrapper full-page-wrapper">
      <div className="content-wrapper d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">

              {/* Logo */}
              <div className="brand-logo"> <img src="/assets/images/logo-dark.svg" alt="logo" /></div>

              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light text-muted">  Sign in to continue.</h6>

              {/* Message Alert */}
              {message && (
                <div
                  className={`alert ${ messageType === "success" ? "alert-success" : "alert-danger" } mt-3`} >  {message}</div> )}

              <form className="pt-3" onSubmit={handleSubmit}>

                {/* Email */}
                <div className="form-group">
                  <input type="email" name="email" className="form-control form-control-lg" id="exampleInputEmail1" placeholder="Email" required
                  />
                </div>

                {/* Password with toggle */}
                <div className="form-group position-relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className="form-control form-control-lg"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-sm position-absolute"
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#6c7293",
                    }}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    tabIndex="-1"
                  >
                    <i
                      className={
                        passwordVisible
                          ? "typcn typcn-eye-outline"
                          : "typcn typcn-eye"
                      }
                      style={{ fontSize: "18px" }}
                    ></i>
                  </button>
                </div>

                {/* Remember me + Forgot password */}
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input
                        type="checkbox"
                        name="remember"
                        className="form-check-input"
                      />
                      Keep me signed in
                    </label>
                  </div>

                  <a
                    href="#"
                    className="auth-link text-primary"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    disabled={loading}
                  >
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center mt-4 font-weight-light text-muted">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-weight-medium">
                    Create
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}