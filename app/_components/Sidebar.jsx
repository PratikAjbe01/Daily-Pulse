'use client';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';

export default function Sidebar({ open, onClose }) {
    const {isSignedIn}=useUser();
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0  bg-white/20 backdrop-blur-lg 
  border-b border-white/20 shadow-md-gray bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <Button variant={'outline'}
            onClick={onClose}
            className="p-2 rounded border-black"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6 bg-black text-white" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
            {
                isSignedIn?  <UserButton/>:<></>
            }
          
          <a href="#" className="block text-gray-700 hover:text-gray-900">
            Home
          </a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">
            About
          </a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
