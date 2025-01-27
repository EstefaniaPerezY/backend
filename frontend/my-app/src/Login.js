
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from 'react';
import { API_URL } from "./config";


function Login({ setToken, setUserData }) {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const email = useRef("")
    const password = useRef("")
    function submitLogin(e){
        e.preventdefault();
        let successful = false
        fetch(API_URL+"/token", {
          method: "POST",
          body: new URLSearchParams({
            'username': email.current.value,
            'password': password.current.value
          })
        }).then((data) => {
          if(data.status === 200){
            successful = true
          }
          return data.json()
        })
        .then((data) => {
          if(successful){
            localStorage.setItem("token", data.access_token)
            fetch(API_URL+"/users/me/", {
              headers: {"Authorization": "Bearer "+data.access_token}
            })
            .then((data) => {
              return data.json()
            })
            .then((data) => {
              fetch("https://api.github.com/users/" +data.github_user)
              .then((data) => {
                localStorage.setItem("userData", JSON.stringify(data))
                setUserData(data)
                setToken(localStorage.getItem("token"))
                navigate(urlParams.get("next") || "/" )
              })
            })

          }else {
            throw new Error(data.detail)
          }
        })
        .catch((data) => alert(data))

    }
    return (
          <>
          <h1> Sign in </h1>
          <form onSubmit={submitLogin}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input ref={email} className="form-control" id="floatingInput" placeholder="name@example.com"/>
          <label for="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input ref={password} className="form-control" id="floatingPassword" placeholder="Password"/>
          <label for="floatingPassword">Password</label>
        </div>

        <div className="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me"/> Remember me 
          </label>
        </div>
        <button type="submit" className="w-100 btn btn-lg btn-primary">Sign in</button>
        <p className="mt-5 mb-3 text-muted">© 2017–2022</p>
      </form> 
      </>
    );
}

export default Login;