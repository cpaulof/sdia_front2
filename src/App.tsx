import React from 'react';
 
import './index.css';
import NavBar from './components/navbar';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Skeleton } from "~/components/ui/skeleton"

import { Separator } from "~/components/ui/separator"
import Base from './pages/Base';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Blog from './pages/Blog';





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Base />}>
          <Route index element={<AboutMe />} />
          <Route path="projects" element={<Projects />} />
          <Route path="aboutme" element={<AboutMe />} />
          <Route path="exp/:mission_id" element={<Experience />} />
          <Route path="blog" element={<Blog />} />
          <Route path="aboutme" element={<AboutMe />} />
          <Route path="*" element={<h1 className='text-3xl font-semibold'>Página não encontrada!</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
