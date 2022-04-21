import "../css/styles.css"
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { url} from "../API";
import NavBar from "../components/nav"
import MenuItems from "../components/menuitems";
import Blogs from "../components/blogs";
import Footer from "../components/footer";


export default function MyBlogs(){
    const [cookies] = useCookies("token");
    let [name, setName] = useState(null);
    let [text, setText] = useState(null);
    let [errormsg, setErrorMsg] = useState("");
    let [rest, setRest] = useState(null);
    let [loading, setLoading] = useState(true);
    let [itemReload, reloadItems] = useState(true);
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
    }}


    var nav = useNavigate();

    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }

    useEffect(()=> {
        if(!cookies.token){
            nav("/");
        }
        fetch(url+"my_restaurant/", payload).then((resp) => resp.json())
        .then(body => {setRest(body); setLoading(false);}).catch(()=>{nav("/")});
    }, []);



      function handleSubmit(event){
        event.preventDefault();
        if(!(name&&text)){
            setErrorMsg("enter all fields");
            return;
        }
        let payloadBody = JSON.stringify({name: name, text: text})
        let payload = {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: payloadBody
        }

        fetch(url+"blogs/", payload).then(function(res){
            reloadItems((prev)=>!prev);
        });
    }

    function blogItems(){
        if(loading){
            return(<p>Loading</p>)
        }else{
            return(<Blogs id={rest.id} reload={itemReload} setReload={reloadItems} edit={true}/>)
        }
    }

  

    return (
        <div>
            <NavBar />
            <div class="main-container">
            <div class="blog-container">
            <h1>Blog Posts</h1>
            <div class="center">
            {blogItems()}
            </div>
            <h2>Add Post</h2>
            <div class="blogform-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" onChange={handleChange(setName)}/> <br></br>
                <label htmlFor="text"> Text: </label>
                <input type="text" name="text" onChange={handleChange(setText)}/> <br></br>
                <p>{errormsg}</p>
                <input type="submit" value="Add Item"></input>
            </form>
            </div>
            </div>
            </div>
       </div>
    );
}