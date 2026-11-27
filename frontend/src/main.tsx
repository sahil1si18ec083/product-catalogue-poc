import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Listing } from "./pages/Listing";
import { ProductPage } from "./pages/ProductPage";
import "./styles.css";

function App() {
  return <BrowserRouter><Header/><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/category/:name" element={<Listing mode="category"/>}/>
    <Route path="/search" element={<Listing mode="search"/>}/>
    <Route path="/products/:id" element={<ProductPage/>}/>
    <Route path="*" element={<main className="section"><h1>Page not found</h1><a href="/">Return home</a></main>}/>
  </Routes><footer className="footer"><span className="brand"><span className="brand-mark">f.</span> forma<span className="brand-dot">.</span></span><span>Thoughtfully found. Everyday loved.</span><span>© 2026 FORMA STUDIO</span></footer></BrowserRouter>;
}
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);