import React, { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import { url } from "../API";
import { useParams } from "react-router-dom";

export default function UserNotifications(props){
    const [cookies] = useCookies("token");
    let token = cookies.token
    let reload = props.reload;
    let setReload = props.setReload;
    let [loading, setLoading] = useState(true);
    let [items, setItems] = useState(null);
    let [get_url, setUrl] = useState(new URL(url+"notifications/"));
    var nav = useNavigate();
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
        fetch(get_url, payload).then((resp) => resp.json())
        .then(body => {setItems(body); setLoading(false)}).catch(_ => setLoading(false));
    }, [get_url]);

    function goToRestaurantPage(id){
        nav(`/restaurant/${id}`);
    }

    function displayItem(item){
        if (item.etype == "blogpost"){
            return(<li><span class="clickable" onClick={()=>goToRestaurantPage(item.restaurant.id)}>{item.restaurant.name}</span> wrote {item.name}</li>);
        }else if(item.etype=="menuitem"){
            return(<li> <span class="clickable" onClick={()=>goToRestaurantPage(item.restaurant.id)}>{item.restaurant.name}</span> added {item.name}</li>);
        }
    }

    function displayItems(){
        if(items!==null){
            if(items.count==0){
                return(<p>You have no notifications go follow some restaurants</p>)

            }
            if(items.next!==null && items.previous!==null){
            return (<div>
                    {items.results.map(item => displayItem(item))}
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.next!==null){
                return (<div>
                    {items.results.map(item => displayItem(item))}
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.previous!==null){
                return (<div>
                    {items.results.map(item => displayItem(item))}
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                </div>)
             }else{
            return (<div>
                {items.results.map(item => <li>{item.etype}</li>)}
                </div>)
            }
        }else{
            return(<p>Error Loading</p>)

        }
    }

    return(
        <div>{displayItems()}</div>
    );
}