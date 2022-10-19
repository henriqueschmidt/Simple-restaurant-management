import React from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Login from "./login/Login.jsx";
import Menu from "./menu/Menu.jsx";
import Foods from "./foods/Foods.jsx";
import Recipes from "./recipes/Recipes.jsx";
import Users from "./users/Users.jsx";

function App() {
    const default_public = [
        '/',
        '/login',
    ];
    const allowed_routes_by_roles = {
        public: default_public,
        admin: [
            ...default_public,
            '/foods',
            '/recipes',
            '/dashboard',
            '/cozinha',
            '/garcoes',
            '/bartender',
            '/admin',
            '/users',
        ],
        garcom: [
            ...default_public,
            '/garcom',
        ],
        chef: [
            ...default_public,
            '/cozinha',
        ],
        bartender: [
            ...default_public,
            '/bartender',
        ],
        maite: default_public,
        commins: default_public,
    }

    const redirect_to = {
        public: '/',
        admin: '/admin',
        garcom: '/garcom',
        chef: '/cozinha',
        bartender: '/bartender',
        maite: '/',
        commins: '/',
    }

    const user_data = localStorage.getItem('user')
    if (!user_data && !default_public.includes(window.location.pathname) ){
        window.location.replace('/')
    } else {
        const user = JSON.parse(user_data)
        if (!allowed_routes_by_roles[user.user_type].includes(window.location.pathname)) {
            window.location.replace(redirect_to[user.user_type])
        }
    }
    return (
        <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/users" element={<Users />} />

            <Route path="/garcom" element={<Recipes />} />
        </Routes>
    )
}

export default App
