import "../css/styles.css"
import NavBar from "../components/nav";
import { useEffect, useState } from "react";
import { url } from "../API";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

export default function Home() {
  let [loading, setLoading] = useState(true);
  let [rests, setRests] = useState(null);
  let [updateRests, setUpdateRests] = useState(false);
  let [search, setSearch] = useState("");

  var nav = useNavigate();
  let [getUrl, setUrl] = useState(new URL(url+"restaurants/"));

  const local_url = new RegExp('http://127.0.0.1:8000/(.*)');

  function getCorrectUrl(curr_url){
      let match = curr_url.match(local_url);
      return url + match[1];
  }



  useEffect(()=> {
      fetch(getUrl).then((resp) => resp.json())
      .then(body => {setRests(body); setLoading(false)});
  }, [updateRests, getUrl]);

    function goToRestaurantPage(id){
        nav(`/restaurant/${id}`);
    }

    function displayRestuarnt(rest){
      return(<tr onClick={()=>goToRestaurantPage(rest.id)}><td><img class="rest-img" src={url + rest.primarypic}></img></td>
      <td class="rest-info">
        <p><strong>Name: </strong>{rest.name}</p>
        <p><strong>Description: </strong> {rest.desc} </p>
        <p><strong>Location: </strong> {rest.address}, {rest.postalcode} </p>
        <p><strong>Likes: </strong> {rest.likes} </p>
        <p><strong>Followers: </strong> {rest.followers} </p>
        </td>
      </tr>)
    }

    function handleChange(updateFunc) {
        return function (event){
            updateFunc(event.target.value);
        };
    }

  function restaurants(){
    if(loading){
      return(<p>error</p>)
    } else{
      if(rests!==null){
            if(rests.next!==null && rests.previous!=null){
            return (<div>
                <table>
                {rests && rests.results.map(rest=>displayRestuarnt(rest))}
                </table>
                  <div class="center">
                    <button class="btn btn-secondary" onClick={()=>setUrl(getCorrectUrl(rests.previous))}>Prev</button>
                    <button class="btn btn-secondary" onClick={()=>setUrl(getCorrectUrl(rests.next))}>Next</button>
                  </div>
                </div>)
            } else if(rests.next!==null){
                return (<div>
                <table>
                {rests && rests.results.map(rest=>displayRestuarnt(rest))}
                </table>
                  <div class="center">
                    <button class="btn btn-secondary" onClick={()=>setUrl(getCorrectUrl(rests.next))}>Next</button>
                  </div>
                </div>)
            } else if(rests.previous!==null){
                return (<div>
                <table>
                {rests && rests.results.map(rest=>displayRestuarnt(rest))}
                </table>
                  <div class="center">
                    <button class="btn btn-secondary" onClick={()=>setUrl(getCorrectUrl(rests.previous))}>Prev</button>
                  </div>
                </div>)
             }else{
            return (<div>
                <table>
                {rests && rests.results.map(rest=>displayRestuarnt(rest))}
                </table>
                </div>)
             }
     }else{
        return(<p>error</p>)
      }

    }
  }

  function handleSubmit(event){
    event.preventDefault();
    if(search==""){
      setUrl(new URL(url+"restaurants/"))
    }

    setUrl(new URL(url+"restaurants/"+"?search="+search))
  }

    function searchBar(){
        return(<form onSubmit={handleSubmit}>
                <input class="search-bar" type="text" name="username" onChange={handleChange(setSearch)}/> <br></br>
                <input class="btn btn-outline-light btn-lg" type="submit" value="Search"></input>
            </form>)
    }



  // Jumbotron https://mdbootstrap.com/docs/standard/extended/jumbotron/
  return (
    <div>
      <NavBar/>
      <div class="main-container">
      <div class="text-center bg-image rounded-3 my-jumbotron">
  <div class="mask my-jumbo" >
    <div class="d-flex justify-content-center align-items-center h-100">
      <div class="text-white">
        <h1 class="mb-3">Restify</h1>
        <h4 class="mb-3">Social media for restaurants</h4>
        {searchBar()}
      </div>
    </div>
  </div>
</div>
    <div class="restaurant-container">
        {restaurants()}

      </div>
      <Footer/>
      </div>
    </div>
  );
}