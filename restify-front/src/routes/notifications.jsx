import "../css/styles.css"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {url} from "../API";
import NavBar from "../components/nav"
import {useCookies} from "react-cookie";
import UserNotifications from "../components/usernotifications";
import OwnerNotifications from "../components/ownernotifications";
import Footer from "../components/footer";

export default function Notafications(){
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [cookies, setCookie] = useCookies(["user"]);
    let [errormsg, setErrorMsg] = useState("");
    let [loading, setLoading] = useState(true);
    let [rest, setRest] = useState(null);
    let nav = useNavigate();
    let token = cookies.token;
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
    }}
    useEffect(()=> {
        if(!token){
            nav("/")
        }
        fetch(url+"my_restaurant/", payload).then((resp) => resp.json())
        .then(body => {setRest(body); setLoading(false)}).catch(_ => setLoading(false));
    }, []);


    function displayNotifications(){
        if(loading){
            return (<div><p>Loading</p></div>)
        }else if(rest){
            return (<div>
            <h1>User Notificaitons</h1>
            <UserNotifications/>
            <h1>Owner Notificaitons</h1>
            <OwnerNotifications/>
            </div>)
        }else{
            return (<div>
            <h1>User Notificaitons</h1>
            <UserNotifications/>
            </div>)
        }
    }

    return (
        <div>
            <NavBar />
            <div class="main-container">
            <div class="notification-container">
                {displayNotifications()}
                <Footer/>
           </div>
           </div>
        </div>
    );
}