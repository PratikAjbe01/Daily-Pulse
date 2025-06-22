// components/Navbar.js
'use client'
import { MenuIcon } from 'lucide-react';
import {ModeToggle} from './ModeToggle';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
 <>
    <nav className="fixed top-0 left-0 w-full  bg-white/20 backdrop-blur-lg 
  border-b border-white/20 shadow-md-gray z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">DailyPulse</div>
        <div className=" flex items-center space-x-4">
          <ModeToggle/>
          <Button onClick={() => setIsSidebarOpen(true)}>
    <MenuIcon   />
          </Button>
      
        </div>
     
      </div>
    </nav>
     <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
  );
}
