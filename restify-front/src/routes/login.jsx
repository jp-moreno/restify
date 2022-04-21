import "../css/styles.css"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {url} from "../API";
import NavBar from "../components/nav"
import {useCookies} from "react-cookie";
import Footer from "../components/footer";

export default function Login(){
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [cookies, setCookie] = useCookies(["user"]);
    let [errormsg, setErrorMsg] = useState("");
    let nav = useNavigate();

    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }

    function handleSubmit(event){
        event.preventDefault();
        if(!(password&&username)){
            setErrorMsg("enter all fields");
            return;
        }
        let payload = Object.assign(
            {body: JSON.stringify({username: username, password: password})
                        , method: "POST", headers: {"Content-Type": "application/json"}}
        );
        fetch(url+"token/", payload).then(function(res){
            if(res.status=="200"){
            res.json().then(function(data){
                setCookie("token", data.access)
                nav("/");
                //window.location.reload();
            });
            }else{
                setErrorMsg("Wrong username or password")
            }
        }).catch((err) => setErrorMsg("Wrong username or password"));


    }


  // Jumbotron https://mdbootstrap.com/docs/standard/extended/jumbotron/
    return (
        <div>
            <NavBar />
            <div class="main-container">
<div class="text-center bg-image rounded-3 my-jumbotron">
  <div class="mask my-jumbo" >
    <div class="d-flex justify-content-center align-items-center h-100">
      <div class="text-white">
        <h1 class="mb-3">Restify</h1>
        <h4 class="mb-3">Social media for restaurants</h4>
      </div>
    </div>
  </div>
</div>
            <div class="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username"> Username: </label>
                <input type="text" name="username" onChange={handleChange(setUsername)}/> <br></br>
                <label htmlFor="password"> Password: </label>
                <input type="password" name="password" onChange={handleChange(setPassword)}/> <br></br>
                <p>{errormsg}</p>
                <input class="login-button" type="submit" value="Login"></input>
            </form>
            </div>
<Footer/>
            </div>
        </div>
    );
}