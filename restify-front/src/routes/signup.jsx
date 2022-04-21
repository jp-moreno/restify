import "../css/styles.css"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {url} from "../API";
import NavBar from "../components/nav"
import Footer from "../components/footer";

const name_regex = /^[A-Za-z]{3,20}$/
const user_regex = /^[A-Za-z0-9_]{5,20}$/
const phone_regex = /^\d{3}-\d{3}-\d{4}$/

export default function Signup(){
    const [firstname, setFirstName] = useState(null);
    const [lastname, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [phonenum, setPhoneNum] = useState(null);
    let [errormsg, setErrorMsg] = useState("");
    var nav = useNavigate();

    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }

    function handleSubmit(event){
        event.preventDefault();
        setErrorMsg("");
        if(!(firstname&&lastname&&email&&password&&username&&phonenum)){
            setErrorMsg("enter all fields");
            return;
        }
        if(!name_regex.test(firstname)){
            setErrorMsg("First name must be 3-20 Letters");
            return;
        }
        if(!name_regex.test(lastname)){
            setErrorMsg("Last name must be 3-20 Letters");
            return;
        }
        if(!user_regex.test(username)){
            setErrorMsg("Username must be 5-20 Letters, Numbers and Underscores");
            return;
        }

        if(!phone_regex.test(phonenum)){
            setErrorMsg("Phone number must be in format xxx-xxx-xxxx where x are numbers");
            return;
        }

        if(!user_regex.test(password)){
            setErrorMsg("Password must be 5-20 Letters, Numbers and Underscores");
            return;
        }


        let payload = Object.assign(
            {body: JSON.stringify({username: username, email:email, password: password, first_name: firstname, last_name: lastname, phonenumber:phonenum})
                        , method: "POST", headers: {"Content-Type": "application/json"}}
        );
        console.log(payload);
        fetch(url+"users/", payload).then(function(res){
            console.log(res);
            if(res.status == "201"){
                nav("/login");
            } else{
                setErrorMsg("User already exists");
            }
        });


    }

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
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstname"> First Name: </label>
                <input type="text" name="firstname" onChange={handleChange(setFirstName)}/> <br></br>
                <label htmlFor="lastname"> Last Name: </label>
                <input type="text" name="lastname" onChange={handleChange(setLastName)}/> <br></br>
                <label htmlFor="username"> Username: </label>
                <input type="text" name="username" onChange={handleChange(setUsername)}/> <br></br>
                <label htmlFor="email"> Email: </label>
                <input type="email" name="email" onChange={handleChange(setEmail)}/> <br></br>
                <label htmlFor="phonenumber"> Phone Number: </label>
                <input type="text" name="phonenumber" onChange={handleChange(setPhoneNum)}/> <br></br>
                <label htmlFor="password"> Password: </label>
                <input type="password" name="password" onChange={handleChange(setPassword)}/> <br></br>
                <p>{errormsg}</p>
                <input class="login-button" type="submit" value="Signup"></input>
            </form>
            </div>
            <Footer/>
            </div>
        </div>
    );
}