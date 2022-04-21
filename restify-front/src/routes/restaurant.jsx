import "../css/styles.css"
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import { url} from "../API";
import NavBar from "../components/nav"
import { useParams } from "react-router-dom";
import MenuItems from "../components/menuitems";
import Comments from "../components/comments";
import Blogs from "../components/blogs";
import LikeButton from "../components/likebutton";
import FollowButton from "../components/followbutton";
import Footer from "../components/footer";

// todo only show follow and like buttoon to logged in

export default function Restaurant(){
    const [cookies] = useCookies("token");
    let params = useParams();
    let token = cookies.token;
    let [rest, setRest] = useState(null);
    let [text, setText] = useState(null);
    let [errormsg, setError] = useState("");
    let [updateRest, setUpdateRest] = useState(true);
    let [blogReload, setBlogReload] = useState(true);
    let [reloadComments, setReloadComments] = useState(true);
    let [loading, setLoading] = useState(true);
    let [itemReload, reloadItems] = useState(true);
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({restaurant_id:params.id})
    }

    let payload1 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({restaurant_id:params.id})
    }

    useEffect(()=> {
        fetch(url+"restaurant/", payload1).then((resp) => resp.json())
        .then(body => {setRest(body); setLoading(false)});
    }, [updateRest]);

    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }


    function menuItems(){
        if(loading){
            return(<p>Loading</p>)
        }else{
            return(<MenuItems id={rest.id} reload={itemReload} setReload={reloadItems} edit={false}/>);
        }
    }


    function handleSubmit(event, id){
        event.preventDefault();
            payload = {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
        body: JSON.stringify({restaurant_id:params.id, text:text})
    }
        fetch(url+"comments/", payload).then((resp) => {setReloadComments((prev)=>!prev)})

    }

    function blogItems(){
        if(loading){
            return(<p>Loading</p>)
        }else{
            return(<Blogs id={rest.id} reload={itemReload} setReload={reloadItems} edit={false}/>)
        }
    }




    function restaurantInfo(){
        if(rest && token){
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
                    <p><strong>Phone Number: </strong>{rest.phonenumber}</p>
                    <p><strong>Likes, Followers: </strong>{rest.likes}, {rest.followers}</p>
                    <strong>Logo: </strong><img class="logo-img" src={url+ rest.logo}></img>
                </div>
            </div>
            <div class="center">
            <LikeButton id={rest.id} reload={updateRest} setReload={setUpdateRest}/>
            <FollowButton id={rest.id} reload={updateRest} setReload={setUpdateRest}/>
            </div>
             <div class="row text-center">
                <div class="col-8">
            <h2>Menu</h2>
            <div class="center">
                {menuItems()}
            </div>

               </div>
                <div class="col-4">
                    <h2>Blogs</h2>
            <div class="center">
                    {blogItems()}
            </div>

                 </div>
           </div>
                <div class="comment-container">
                <h2>Comments</h2>
                <form onSubmit={(event)=>{handleSubmit(event, rest.id)}}>
                    <input type="text" name="name" onChange={handleChange(setText)}/>
                    <input type="submit" value="Comment"></input>
                </form>
                <Comments id={rest.id} reload={reloadComments} setReload={setReloadComments}/>
            </div>
       </div>)
        } else if(rest){
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
                    <p><strong>Phone Number: </strong>{rest.phonenumber}</p>
                    <p><strong>Likes, Followers: </strong>{rest.likes}, {rest.followers}</p>
                    <strong>Logo: </strong><img class="logo-img" src={url + rest.logo}></img>
                </div>
            </div>
            <div class="center">
            </div>
             <div class="row text-center">
                <div class="col-8">
            <h2>Menu</h2>
            <div class="center">
                {menuItems()}
            </div>

               </div>
                <div class="col-4">
                    <h2>Blogs</h2>
            <div class="center">
                    {blogItems()}
            </div>

                 </div>
           </div>
                <div class="comment-container">
                <h2>Comments</h2>
                <Comments id={rest.id} reload={reloadComments} setReload={setReloadComments}/>
            </div>
       </div>)
        } else{
            return(<div>
                <h1>Not found</h1>
                </div>)

        }
    }

    return (
        <div>
            <NavBar />
            <div class="main-container">
            {restaurantInfo()}
            <Footer/>
            </div>
       </div>
    );
}