import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Specialties } from "@/components/Specialties";
import { Maison } from "@/components/Maison";
import { OrderForm } from "@/components/OrderForm";
import { Location } from "@/components/Location";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenu">
        <Hero />
        <Specialties />
        <Maison />
        <OrderForm />
        <Location />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
