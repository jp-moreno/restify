import React, { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import { url } from "../API";

export default function NavBar(props){
    const [cookies, setCookie, removeCookie] = useCookies("user");
    let reload = props.reload;
    let setReload = props.setReload;
    let [rest, setRest] = useState(null);
    let [user, setUser] = useState(null);
    let [loading, setLoading] = useState(true);

    var nav = useNavigate();

    let token = cookies.token;
    let bearer = "Bearer " + cookies.token;

    let payload = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
    }}

    let payload2 = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
    }}



    useEffect(()=> {
        if(token){
       fetch(url+"me/", payload).then((resp) => {
            if(resp.status == "401" && token) {
                removeCookie("token");
                nav('/');
                window.location.reload();
            } else if(resp.status != "401"){
                resp.json().then(body => setUser(body));
            fetch(url+"my_restaurant/", payload2).then((resp) => resp.json())
            .then(body => {
                setRest(body);
                setLoading(false);
            }
                ).catch(()=>setLoading(false));
            }else{
                setLoading(false);
            }

        })
    }else{
        setLoading(false);
    }
    }, [reload]);



    function handleClick(name){
        return function(event){
            event.preventDefault();
            nav(`/${name}`)
        }
    }

    function handleLogOut(){
        return function (event){
            event.preventDefault();
            removeCookie("token");
            nav('/');
            window.location.reload();
        }
    }

    function navBarDisplay(){
        if(loading){
            return (<div></div>)
        }else{
        if(token && rest){
            return(
            <ul class="my-nav flex-column">
                <li class="my-nav-item" onClick={handleClick("")}>Home</li>
                <li class="my-nav-item" onClick={handleClick("notifications")}>Notifications</li>
                <li class="my-nav-item" onClick={handleClick("profile")}>Profile</li>
                <li class="my-nav-item" onClick={handleClick("your_restaurant")}>Restaurant</li>
                <li class="my-nav-item" onClick={handleClick("your_menu")}>Update Menu</li>
                <li class="my-nav-item" onClick={handleClick("your_blog")}>Update Blog</li>
                <li class="my-nav-item" onClick={handleLogOut()}>Log Out</li>
            </ul>)
        }else if(token){
            return(
            <ul class="my-nav flex-column">
                <li class="my-nav-item" onClick={handleClick("")}>Home</li>
                <li class="my-nav-item" onClick={handleClick("notifications")}>Notifications</li>
                <li class="my-nav-item" onClick={handleClick("profile")}>Profile</li>
                <li class="my-nav-item" onClick={handleClick("your_restaurant")}>Restaurant</li>
                <li class="my-nav-item" onClick={handleLogOut()}>Log Out</li>
            </ul>)
        }else{
            return(
                <ul class="my-nav flex-column">
                    <li class="my-nav-item" onClick={handleClick("")}>Home</li>
                    <li class="my-nav-item" onClick={handleClick("login")}>Log in</li>
                    <li class="my-nav-item" onClick={handleClick("signup")}>Sign up</li>
                </ul>)
        }
        }
    }
    return (
        <div class="navbar">
            {navBarDisplay()}
        </div>
    );
}