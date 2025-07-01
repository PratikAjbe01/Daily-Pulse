'use client'
import { useEffect } from "react";
import Footer from "./_components/footer";
import HeroSection from "./_components/Hero";
import HowWeHelpSection from "./_components/how-we-help";

import WhySection from "./_components/why-section";



import { useUser } from "@clerk/nextjs";
import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase";

export default function Home() {
const { isLoaded, user } = useUser();

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BFE3N-zK2HVgYWfOpz303uVHvjaZQJ27qRDIcwSrJJBaxPJg_7p0BDbyY1tFXS0ZDjTbqBGQvWmaNrH4oU23gqE",
      });
      console.log("Token Gen", token);
      // Send this token  to server ( db)
        
  
      const email = user?.primaryEmailAddress?.emailAddress;
console.log("Sending token to server with email:", email);
  const res = await fetch("/api/user-info", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  email,
    fcmToken: token
  }),
});
console.log("Saved token?", res.ok);
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }


  useEffect(() => {
  if (!isLoaded || !user || typeof window === "undefined") return;
     
    requestPermission();
  }, [isLoaded, user]);





  return (
<>

<main className="pt-16">
<HeroSection/>
      <WhySection/>
    <HowWeHelpSection/>
    <Footer/>

</main>
</>
  );
}
