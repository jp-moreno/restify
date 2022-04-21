import "../css/styles.css"
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { url} from "../API";
import NavBar from "../components/nav"
import Footer from "../components/footer";

const phone_regex = /^\d{3}-\d{3}-\d{4}$/
const pc_regex = /^[\dA-Z]{6}$/

export default function YourRestaurant(){
    const [cookies] = useCookies("token");
    let [name, setName] = useState(null);
    let [desc, setDesc] = useState(null);
    let [address, setAddress] = useState(null);
    let [postalcode, setPostalCode] = useState(null);
    let [phonenum, setPhonenum] = useState(null);
    let [errormsg, setErrorMsg] = useState("");
    let [navBarReload, setNavbarReload] = useState()
    let [rest, setRest] = useState(null);
    let [mainPic, setMainPic] = useState(null);
    let [logo, setLogo] = useState(null);
    let [loading, setLoading] = useState(true);
    let [updateRest, setUpdateRest] = useState(true);
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

    var nav = useNavigate();
    useEffect(()=> {
        if(!token){
            nav("/")
        }
        fetch(url+"my_restaurant/", payload).then((resp) => resp.json())
        .then(body => {setRest(body); setLoading(false)}).catch(_ => setLoading(false));
    }, [updateRest]);



    function mainpicHandeler(event){
        if (event.target.files[0]) {
            setMainPic(event.target.files[0]);
        } else{
            setMainPic(false);
        }
    }

    function logoHandeler(event){
        if (event.target.files[0]) {
            setLogo(event.target.files[0]);
        } else{
            setLogo(false);
        }
    }

    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }

    function deleteRestaurant(){
        let payload = {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
        }}

        fetch(url+"restaurants/", payload).then(() => nav("/"));
    }

    function handleSubmit(event){
        event.preventDefault();
        setErrorMsg("");
        if(!(name&&desc&&phonenum&&address&&postalcode)){
            setErrorMsg("enter all fields");
            return;
        }

        if(!phone_regex.test(phonenum)){
            setErrorMsg("Phone number must be in format xxx-xxx-xxxx where x are numbers");
            return;
        }

        if(!pc_regex.test(postalcode)){
            setErrorMsg("Postal code must 6 long consiting of capital letters and numbers")
            return;
        }



        let payloadBody = JSON.stringify({name: name, desc: desc, address:address, postalcode: postalcode, phonenumber:phonenum});
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

        fetch(url+"restaurants/", payload).then(function(res){
            setUpdateRest((prev) => !prev);
            setNavbarReload((prev) => !prev)
        });
    }

    function handleSubmitUpdate(event){
        event.preventDefault();
        if(!(name||desc||phonenum||address||postalcode||logo||mainPic)){
            setErrorMsg("enter a field");
            return;
        }
        if(logo){
            const formData = new FormData();
            formData.append("pic", logo);
            let payload2 = {method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                //'Content-Type': 'application/json'
            },
            body: formData,
        }
            fetch(url+"logo_pic/", payload2);
            //payloadBody.pic = File.get(profilepic);
        }        

        if(mainPic){
            const formData = new FormData();
            formData.append("pic", mainPic);
            let payload2 = {method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                //'Content-Type': 'application/json'
            },
            body: formData,
        }
            fetch(url+"rest_pic/", payload2);
            //payloadBody.pic = File.get(profilepic);
        }
        let payloadBody = {};
        if(name){
            payloadBody.name = name;
        }
        if(desc){
            payloadBody.desc = desc;
        }
        if(address){
            payloadBody.address = address;
        }
        if(postalcode){
            payloadBody.postalcode = postalcode;
        }
        if(phonenum){
            payloadBody.phonenumber = phonenum;
        }

        let payload = {
            method: 'PATCH',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadBody)
        }

        fetch(url+"restaurants/", payload).then(function(res){
            setUpdateRest((prev) => !prev);
        });
    }

    function goToRestaurantPage(id){
        nav(`/restaurant/${id}`);
    }

    function restaurantInfo(){
        if(loading){
            return (<div></div>)
        }else{
        
        if(rest){
            return (<div class="myrest-container">
            <h1>Restaurant</h1>
            <div class="row">
                <div class="col-6">
                    <img class="primaryrest-img" src={url + rest.primarypic}></img>
                </div>
                <div class="col-6 rest-info">
                    <p><strong>Name: </strong>{rest.name}</p>
                    <p><strong>Description: </strong>{rest.desc}</p>
                    <p><strong>Location: </strong>{rest.address}, {rest.postalcode}</p>
                    <strong>Logo: </strong><img class="logo-img" src={url + rest.logo}></img>
                    <p><strong>Page: </strong> <span onClick={()=>goToRestaurantPage(rest.id)} class="clickable">view</span></p>
                </div>
            </div>

            <div class="update-rest-container">
            <form onSubmit={handleSubmitUpdate}>
                <label htmlFor="name"> Name: </label>
                <input type="text" name="name" onChange={handleChange(setName)}/> <br></br>
                <label htmlFor="desc"> Description: </label>
                <input type="text" name="desc" onChange={handleChange(setDesc)}/> <br></br>
                <label htmlFor="phonenumber"> Phone Number: </label>
                <input type="text" name="phonenumber" onChange={handleChange(setPhonenum)}/> <br></br>
                <label htmlFor="address">Address: </label>
                <input type="text" name="address" onChange={handleChange(setAddress)}/> <br></br>
                <label htmlFor="postalcode"> Postal Code: </label>
                <input type="text" name="postalcode" onChange={handleChange(setPostalCode)}/> <br></br>
                <label htmlFor="mainpic"> Main Picture: </label>
                <input type="file" name="mainpic" id="profile-photo-input" onChange={mainpicHandeler}/> <br></br>
                <label htmlFor="log"> Logo: </label>
                <input type="file" name="logo" id="profile-photo-input" onChange={logoHandeler}/> <br></br>
                <p>{errormsg}</p>
                <input class="btn btn-primary" type="submit" value="Update"></input>
            </form>
            </div>
             <div class="center">
            <h2>Delete Restaurant</h2>
            </div>
             <div class="center">
            <button class="btn btn-danger" onClick={deleteRestaurant}>Delete</button>
            </div>
        </div>)
        } else{
            return(<div>
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
            <h1>Create Restaurant</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name"> Name: </label>
                <input type="text" name="name" onChange={handleChange(setName)}/> <br></br>
                <label htmlFor="desc"> Description: </label>
                <input type="text" name="desc" onChange={handleChange(setDesc)}/> <br></br>
                <label htmlFor="phonenumber"> Phone Number: </label>
                <input type="text" name="phonenumber" onChange={handleChange(setPhonenum)}/> <br></br>
                <label htmlFor="address">Address: </label>
                <input type="text" name="address" onChange={handleChange(setAddress)}/> <br></br>
                <label htmlFor="postalcode"> Postal Code: </label>
                <input type="text" name="postalcode" onChange={handleChange(setPostalCode)}/> <br></br>
                <p>{errormsg}</p>
                <input type="submit" value="Create"></input>
            </form>
            </div>
            </div>)

        }
        }

    }

    return (
        <div>
            <NavBar reload={navBarReload} setReload={setNavbarReload}/>
            <div class="main-container">{restaurantInfo()}
            <Footer/></div>
       </div>
    );
}