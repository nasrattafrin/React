import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
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

                <div className="brand-logo">
                  <img src="assets/images/logo-dark.svg" alt="logo" />
                </div>

                <h4>New here?</h4>
                <h6 className="font-weight-light">
                  Signing up is easy. It only takes a few steps
                </h6>
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
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      id="exampleInputPassword1"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-lg"
                      id="exampleInputConfirmPassword1"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          required
                        />
                        I agree to all Terms & Conditions
                      </label>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="submit"
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">
                      SIGN UP
                    </button>
                  </div>

                  <div className="text-center mt-4 font-weight-light">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary">
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