import "../css/styles.css"
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { POST_FETCH, url} from "../API";
import NavBar from "../components/nav"
import Footer from "../components/footer";

const name_regex = /^[A-Za-z]{3,20}$/
const user_regex = /^[a-z0-9_]{5,20}$/
const phone_regex = /^\d{3}-\d{3}-\d{4}$/


export default function Profile(){
    const [firstname, setFirstName] = useState(null);
    const [lastname, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [profilepic, setProfilepic] = useState(null);
    const [password, setPassword] = useState(null);
    const [phonenum, setPhoneNum] = useState(null);
    const [updateUser, setUpdateuser] = useState(true);
    const [cookies] = useCookies("token");
    let token = cookies.token;
    let [errormsg, setErrorMsg] = useState("");
    let [user, setUser] = useState({name: ""});
    let bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
    }}

    var nav = useNavigate();

    useEffect(()=> {
        if(!token){
            nav("/");
        }
        fetch(url+"me/", payload).then((resp) => resp.json())
        .then(body => setUser(body));
    }, [updateUser]);



    function fileHandeler(event){
        if (event.target.files[0]) {
            setProfilepic(event.target.files[0]);
        } else{
            setProfilepic(false);
        }
    }


    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }

    function handleSubmit(event){
        event.preventDefault();
        setErrorMsg("");
        if(!(firstname||lastname||email||password||phonenum||profilepic)){
            setErrorMsg("enter at least one field");
            //setErrorMsg(function(){return "enter all"});
            return;
        }

        // https://dev.to/racheladaw/uploading-profile-pictures-in-a-react-and-rails-api-application-part-i-3nan
        if(profilepic){
            const formData = new FormData();
            formData.append("pic", profilepic);
            let payload2 = {method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                //'Content-Type': 'application/json'
            },
            body: formData,
        }
            fetch(url+"user_pic/", payload2);
            //payloadBody.pic = File.get(profilepic);
        }
        let payloadBody = {};
        if(firstname){
            if(!name_regex.test(lastname)){
                setErrorMsg("Last name must be 3-20 Letters");
                return;
            }
            payloadBody.first_name = firstname;
        }
        if(lastname){
            if(!name_regex.test(lastname)){
                setErrorMsg("Last name must be 3-20 Letters");
                return;
            }
            payloadBody.last_name = lastname;
        }

        if(email){
            payloadBody.email = email;
        }

        if(phonenum){
            if(!phone_regex.test(phonenum)){
                setErrorMsg("Phone number must be in format xxx-xxx-xxxx where x are numbers");
                return;
            }
            payloadBody.phonenumber = phonenum;
        }
        if(password){
            if(!user_regex.test(password)){
                setErrorMsg("Password must be 5-20 Letters, Numbers and Underscores");
                return;
            }
             payloadBody.password = password;
        }

            
        let payload = Object.assign({
            method: 'PATCH',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadBody)}
        );
        fetch(url+"edit_user/", payload).then(function(res){
            setUpdateuser((prev) => !prev);
        });


    }

    return (
        <div>
            <NavBar />
            <div class="main-container">
            <div class="profile-container">
            <h1>Profile</h1>
            <div class="card profile-card" >
                <div class="row">
                    <div class="col-3">
                        <img  src={"http://localhost:8000" + user.pic} class="profile-img"></img>
                    </div>
                    <div class="col-9">
                        <div class="card-body">
                        <p class="profile-text"><strong>Name: </strong>{user.last_name}, {user.first_name}</p>
                        <p class="profile-text"><strong>Email: </strong>{user.email}</p>
                        <p class="profile-text"><strong>Phone Number: </strong>{user.phonenumber}</p>
                        </div>
                    </div>
                </div>
            </div> 
            </div>
           <div class="update-profile-container">
            <h2>Update info</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstname"> First Name: </label>
                <input type="text" name="firstname" onChange={handleChange(setFirstName)}/> <br></br>
                <label htmlFor="lastname"> Last Name: </label>
                <input type="text" name="lastname" onChange={handleChange(setLastName)}/> <br></br>
                <label htmlFor="email"> Email: </label>
                <input type="email" name="email" onChange={handleChange(setEmail)}/> <br></br>
                <label htmlFor="phonenumber"> Phone Number: </label>
                <input type="text" name="phonenumber" onChange={handleChange(setPhoneNum)}/> <br></br>
                <label htmlFor="password"> Password: </label>
                <input type="password" name="password" onChange={handleChange(setPassword)}/> <br></br>
                <label htmlFor="profilepic"> Profile Picture: </label>
                <input type="file" name="profilepic" id="profile-photo-input" onChange={fileHandeler}/> <br></br>
                <p>{errormsg}</p>
                <input type="submit" value="Update"></input>
            </form>
            </div>
        <Footer/>
        </div>
        </div>
    );
}