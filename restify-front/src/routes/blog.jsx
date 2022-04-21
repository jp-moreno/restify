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
import BlogLikeButton from "../components/bloglikebutton";
import Footer from "../components/footer";


export default function Blog(){
    const [cookies] = useCookies("token");
    let token = cookies.token;
    let params = useParams();
    var nav = useNavigate();
    let [blog, setBlog] = useState(null);
    let [text, setText] = useState(null);
    let [errormsg, setError] = useState("");
    let [updateBlog, setUpdateBlog] = useState(true);
    let [reloadComments, setReloadComments] = useState(true);
    let [loading, setLoading] = useState(true);
    let [itemReload, reloadItems] = useState(true);
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    let getUrl = new URL(url+"blog/");

    getUrl.searchParams.append("blog_id", params.id);

    useEffect(()=> {
        fetch(getUrl, payload).then((resp) => resp.json())
        .then(body => {setBlog(body); setLoading(false)});
    }, [updateBlog]);

    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }

    function goToRestaurantPage(id){
        nav(`/restaurant/${id}`);
    }



    function renderBlog(){
        if(loading){
            return(<p>Loading</p>)
        }else{
            if(token){
            return(<div>
                <h2>{blog.name}</h2>
                <p><strong>Liked: </strong>{blog.likes}</p>
                <p onClick={()=>goToRestaurantPage(blog.restaurant.id)}><strong>By: </strong><span class="clickable">{blog.restaurant.name}</span></p>
                <p>{blog.text}</p>
                <div class="center"><BlogLikeButton id={blog.id} reload={updateBlog} setReload={setUpdateBlog}/></div>

            </div>);
            }else{
            return(<div>
                <h2>{blog.name}</h2>
                <p><strong>Liked: </strong>{blog.likes}</p>
                <p>By: {blog.restaurant.name} <button onClick={()=>goToRestaurantPage(blog.restaurant.id)}>Vist</button></p>
                <p>{blog.text}</p>
            </div>);


            }
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

    function restaurantInfo(){
        if(blog){
            return (<div class="blog-container">
            {renderBlog()}
                <Footer/>
       </div>)
        } else{
            return(<div class="blog-container">
                <h1>Not found</h1>
                <Footer/>
                </div>)

        }
    }

    return (
        <div>
            <NavBar />
            <div class="main-container">
                {restaurantInfo()}
            </div>
       </div>
    );
}