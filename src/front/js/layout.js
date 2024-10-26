import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Navbar } from "./component/navbar";
import Footer from "./component/footer";
import { Home } from "./pages/home";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile";
import NewBet from "./pages/NewBet";
import MyBets from "./pages/MyBets";
import Stats from "./pages/Stats";
import Ranking from "./pages/Ranking";
import AboutUs from "./pages/AboutUs";
import User from "./pages/User";

import injectContext from "./store/appContext";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<NewBet />} path="/newbet" />
                        <Route element={<MyBets />} path="/mybets" />
                        <Route element={<Stats />} path="/stats" />
                        <Route element={<Ranking />} path="/ranking" />
                        <Route element={<AboutUs />} path="/about" />
                        <Route element={<User />} path="/user/:id" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
