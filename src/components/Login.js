import React, { useContext } from "react";
import { googlesigninwrapper, loginWrapper, logoutWrapper } from "../firebase";
import { globalStore } from "./UserContext";
import { Link, useHistory } from "react-router-dom";
const Login = (props) => {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  console.log(error);

  const resolve = () => {
    history.push("/feed");
  };
  const reject = () => {
    setError("Login failed try again");
  };
  return (
    <div className="min-w-screen min-h-screen">
      <div className="lg:max-w-4xl mx-auto flex flex-col items-center justify-center px-5 py-5 mt-20">
        <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden md:flex">
          <div className="hidden w-1/2 bg-green-500 py-10 px-10 md:flex flex-col items-center justify-center">
            <div className="text-4xl font-bold mb-12 text-white text-center flex justify-center items-center">
              <div>Connect with people on Whatsapp!</div>
            </div>
            <Link to="/signup" className="text-white mt-6 ">
              Click here to create an account
            </Link>
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">LOGIN</h1>
              <p>Enter your information to login</p>
            </div>
            <div>
              <div class="flex -mx-3">
                <div class="w-full px-3 mb-5">
                  <label for="" class="text-xs font-semibold px-1">
                    Email
                  </label>
                  <div class="flex">
                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                    <input
                      type="email"
                      value={email}
                      class="w-full -ml-10 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500"
                      placeholder="johnsmith@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div class="flex -mx-3">
                <div class="w-full px-3 mb-12">
                  <label for="" class="text-xs font-semibold px-1">
                    Password
                  </label>
                  <div class="flex">
                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"></div>
                    <input
                      type="password"
                      class="w-full -ml-10 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500"
                      placeholder="************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs text-red-600 mx-auto text-center mb-2">
                {error.length ? error : ""}
              </div>
              <div class="flex -mx-3">
                <div class="w-full px-3 mb-5">
                  <button
                    class="block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold"
                    onClick={() => {
                      loginWrapper(email, password, undefined, (err) => {
                        setError(err.message);
                      });
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
              <div class="flex -mx-3">
                <div class="w-full px-3 mb-5">
                  <button
                    onClick={() => {
                      googlesigninwrapper(resolve, reject);
                    }}
                    class="block w-full max-w-xs mx-auto text-green-500 border-green-700 border-2 rounded-lg px-3 py-3 font-semibold"
                  >
                    Continue with Google
                  </button>
                </div>
              </div>
              {/* <div class="flex -mx-3">
                <div class="w-full px-3 mb-5">
                  <button
                    onClick={() => {
                      logoutWrapper();
                    }}
                    class="block w-full max-w-xs mx-auto text-green-500 border-green-700 border-2 rounded-lg px-3 py-3 font-semibold"
                  >
                    logout
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
