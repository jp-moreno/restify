import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Signup from './routes/signup';
import Login from './routes/login';
import Profile from './routes/profile';
import YourRestaurant from './routes/myrestaurant';
import YourMenu from './routes/menu';
import Restaurant from './routes/restaurant';
import MyBlogs from './routes/myblogs';
import Blog from './routes/blog';
import Home from './routes/home';
import Notafications from './routes/notifications';

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/your_restaurant" element={<YourRestaurant />} />
        <Route path="/your_menu" element={<YourMenu />} />
        <Route path="/your_blog" element={<MyBlogs />} />
        <Route path="/notifications" element={<Notafications />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </CookiesProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
