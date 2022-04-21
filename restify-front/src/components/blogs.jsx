import React, { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import { url } from "../API";
import { useParams } from "react-router-dom";

export default function Blogs(props){
    const [cookies] = useCookies("token");
    let reload = props.reload;
    let setReload = props.setReload;
    var nav = useNavigate();
    let [items, setItems] = useState(null);
    let [updateItems, setUpdateItems] = useState(true);
    let [get_url, updateUrl] = useState(new URL(url+"blogs/"));
    var bearer = "Bearer " + cookies.token;
    let payload = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    get_url.searchParams.append("restaurant_id", props.id);

    useEffect(()=> {
        fetch(get_url, payload).then((resp) => resp.json())
        .then(body => setItems(body));
    }, [updateItems, reload, get_url]);

    function setUrl(newurl){
        updateUrl(new URL(newurl));
    }
    

    function goToBlogPage(id){
        nav("/blog/"+ id);
    }


    function deleteBlog(id){
        let payloadbody = JSON.stringify({blog_id:id})
        let payload2 = {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: payloadbody
    }

        fetch(url+"blogs/", payload2).then(() => setUpdateItems(res=>!res));
    }

    function displayItem(item){
            if(props.edit){
                return(<tr><td><button class="btn btn-danger" onClick={()=>deleteBlog(item.id)}>Delete</button></td><td>{item.name}</td><td><span onClick={()=>goToBlogPage(item.id)} class="clickable">view</span></td></tr>)
            }else{
                return(<tr><td>{item.name}</td><td><span onClick={()=>goToBlogPage(item.id)} class="clickable">view</span></td></tr>)
            }

    }

   function pagination(items){
            if(items.next!==null && items.previous!==null){
            return (<div>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.next!==null){
                return (<div>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.next)}>Next</button>
                </div>)
            } else if(items.previous!==null){
                return (<div>
                    <button class="btn btn-secondary" onClick={()=>setUrl(items.previous)}>Prev</button>
                </div>)
             }else{
            return (<div>
                </div>)
            }
    }

    function dispalyItems(){
        if(items!==null){
            if(props.edit){
            return(<div>
                    <table class="blog-table">
                        <tr><th>Delete</th><th>Name</th><th>Vist</th></tr>
                    {items && items.results.map(item => displayItem(item))}
                    </table>
                    {pagination(items)}
            </div>)
            } else {
            return(<div>
                    <table class="blog-table">
                        <tr><th>Name</th><th>Vist</th></tr>
                    {items && items.results.map(item => displayItem(item))}
                    </table>
                    {pagination(items)}
            </div>)

            }
       } else{
            return (<p>Loading Items</p>)
        }
   }
    return(
        <div>{dispalyItems()}</div>
    );
}