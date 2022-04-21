import "../css/styles.css"
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { url} from "../API";
import NavBar from "../components/nav"
import MenuItems from "../components/menuitems";
import Footer from "../components/footer";


export default function YourMenu(){
    const [cookies] = useCookies("token");
    let [name, setName] = useState(null);
    let [desc, setDesc] = useState(null);
    let [price, setPrice] = useState(null);
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
        if(!(name&&desc&&price)){
            setErrorMsg("enter all fields");
            return;
        }
        let payloadBody = JSON.stringify({name: name, desc: desc, price:price});
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

        fetch(url+"menus/", payload).then(function(res){
            reloadItems((prev)=>!prev);
        });
    }

    function menuItems(){
        if(loading){
            return(<p>Loading</p>)
        }else{
            return(<MenuItems id={rest.id} reload={itemReload} setReload={reloadItems} edit={true}/>);
        }
    }

  

    return (
        <div>
            <NavBar />
            <div class="main-container">
            <div class="menu-container">
            <h1>Menu</h1>
            <h2>Current Menu</h2>
            <div class="center">
                {menuItems()}
            </div>

            <h2>Add Item</h2>
            <div class="update-menu-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" onChange={handleChange(setName)}/> <br></br>
                <label htmlFor="desc"> Description: </label>
                <input type="text" name="desc" onChange={handleChange(setDesc)}/> <br></br>
                <label htmlFor="price"> Price: </label>
                <input type="number" step="any" name="price" onChange={handleChange(setPrice)}/> <br></br>
                <p>{errormsg}</p>
                <input type="submit" value="Add Item"></input>
            </form>
            </div>
            </div>
            <Footer/>
            </div>
       </div>
    );
}