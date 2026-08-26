import { Hero } from "@/components/sections/Hero";
import { EventTypes } from "@/components/sections/EventTypes";
import { VenueTeaser } from "@/components/sections/VenueTeaser";
import { PackagesPreview } from "@/components/sections/PackagesPreview";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <EventTypes />
      <VenueTeaser />
      <PackagesPreview />
      <GalleryTeaser />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
