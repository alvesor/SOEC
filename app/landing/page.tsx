import LandingHeader from './components/LandingHeader';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function LandingPage() {
    return (
        <div>
            <LandingHeader />

            <Hero />

            <Benefits />

            <Testimonials />

            <Footer />
        </div>
    );
}