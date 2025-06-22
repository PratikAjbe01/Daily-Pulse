
import Footer from "./_components/footer";
import HeroSection from "./_components/Hero";
import HowWeHelpSection from "./_components/how-we-help";

import WhySection from "./_components/why-section";


export default function Home() {
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
