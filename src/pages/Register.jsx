import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      setMessage("Your passwords do not match. Please try again.");
      setMessageType("error");
      event.target.elements.confirmPassword.focus();
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_URL}register.php`, {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      })
      .then(() => {
        setMessage("Account created successfully. You can now sign in.");
        
      })
      .catch((error) => {
        console.error("Registration error: ,error");
        setMessage("An error occurred while creating your account.");
        setMessageType("error");
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
              <div className="brand-logo">
                <img src="/assets/images/logo-dark.svg" alt="logo" />
              </div>

              <h4 className="text-dark">New here?</h4>
              <h6 className="font-weight-normal text-secondary">
                Signing up is easy. It only takes a few steps
              </h6>

              {/* Message Alert */}
              {message && (
                <div
                  className={`alert ${
                    messageType === "success"
                      ? "alert-success"
                      : "alert-danger"
                  } mt-3`}
                >
                  {message}
                </div>
              )}

              <form className="pt-3" onSubmit={handleSubmit}>

                {/* Username */}
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    id="exampleInputUsername1"
                    placeholder="Username"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    id="exampleInputEmail1"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* Country */}
                <div className="form-group">
                  <select
                    name="country"
                    className="form-control form-control-lg"
                    id="exampleFormControlSelect2"
                    defaultValue="Country"
                  >
                    <option>Country</option>
                    <option>United States of America</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Germany</option>
                    <option>Argentina</option>
                  </select>
                </div>

                
                {/* Password */}
                <div className="form-group position-relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className="form-control form-control-lg"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    required
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm position-absolute"
                    style={{
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#6c7293",
                      padding: "5px",
                      zIndex: 5,
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
                      style={{ fontSize: "20px" }}
                    ></i>
                  </button>
                </div>

               
                {/* Confirm Password */}
                <div className="form-group position-relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control form-control-lg"
                    id="exampleInputConfirmPassword1"
                    placeholder="Confirm Password"
                    required
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm position-absolute"
                    style={{
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#6c7293",
                      padding: "5px",
                      zIndex: 5,
                    }}
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    tabIndex="-1"
                  >
                    <i
                      className={
                        confirmPasswordVisible
                          ? "typcn typcn-eye-outline"
                          : "typcn typcn-eye"
                      }
                      style={{ fontSize: "20px" }}
                    ></i>
                  </button>
                </div>

                {/* Terms Checkbox — ✅ FIXED */}
                <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="termsCheck"
                      required
                    />
                    <label
                      className="form-check-label text-dark"
                      htmlFor="termsCheck"
                      style={{ fontSize: '14px', cursor: 'pointer' }}
                    >
                      I agree to all{' '}
                      <a
                        href="#"
                        className="text-primary font-weight-medium"
                        onClick={(e) => e.preventDefault()}
                      >
                        Terms &amp; Conditions
                      </a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                  >
                    SIGN UP
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center mt-4 font-weight-normal text-secondary">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-weight-medium"
                  >
                    Login
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