import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mainImage from '../assert/Home.jpg';
import aboutImage from '../assert/About.png';

export default function HomePage() {
  const boxesRef = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    boxesRef.current.forEach((box) => {
      if (box) observer.observe(box);
    });

    return () => observer.disconnect();
  }, []);




  const howItWorksSteps = [
    ['1', 'Book', 'Find and book an appointment with a certified doctor in minutes.'],
    ['2', 'Connect', 'Consult via secure video call, chat, or voice call from anywhere.'],
    ['3', 'Manage', 'Receive prescriptions, reports, and health advice directly on your dashboard.'],
  ];

  // Main Return
  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Header */}
      <header className="py-4 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <div className="text-2xl font-bold">
          <Link to="/" className="flex items-center text-2xl font-bold">
            Best<sup className="text-xs">®</sup>
            <span className="text-teal-500 ml-1">HEALTH</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about-us" className="text-gray-600 hover:text-gray-800">About</a>
          <a href="#services" className="text-gray-600 hover:text-gray-800">Services</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-800">How It Works</a>
          <a href="#for-doctors" className="text-gray-600 hover:text-gray-800">For Doctors</a>
          <a href="#our-impact" className="text-gray-600 hover:text-gray-800">Our Impact</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="hidden sm:block text-gray-800 font-semibold px-4 py-2">
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-lime-400 text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-lime-500 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </header>



      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 h-auto min-h-[40rem] flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text and CTA */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left pt-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Healthcare focused <br /> on <span className="text-teal-500">you</span>
              </h1>
              <p className="text-gray-600 max-w-lg mx-auto lg:mx-0">
                Consult certified doctors online. Book appointments. Track health — anytime, anywhere.
              </p>
              <p className="text-gray-600 max-w-lg mx-auto lg:mx-0">
                Predict diseases from reports, get AI‑based doctor suggestions, and check your heart health instantly.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <Link
                  to="/book-appointment"
                  className="bg-lime-400 text-black font-semibold px-8 py-3 rounded-full shadow-md hover:bg-lime-500 transition-colors inline-block text-center"
                >
                  🩺 Book Appointment
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-black font-semibold px-8 py-3 rounded-full border border-gray-300 shadow-md hover:bg-gray-50 transition-colors inline-block text-center"
                >
                  👨‍⚕️ Join as Doctor
                </Link>
                 <Link
                  to="/signup"
                  className="bg-white text-black font-semibold px-8 py-3 rounded-full border border-gray-300 shadow-md hover:bg-gray-50 transition-colors inline-block text-center"
                >
                  📊 Get suggestions and doctor  Basis of Reports
                </Link>
              </div>
            </div>

            {/* Image and Features Section */}
            <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex flex-col items-center justify-center relative pt-0">
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-32 h-32 bg-lime-300 rounded-full blur-3xl opacity-50"></div>
              </div>
              <div className="w-64 md:w-80 lg:w-[24rem] h-[24rem] rounded-[2.5rem] overflow-hidden transform rotate-2 shadow-2xl mb-8">
                <img
                  src={mainImage}
                  alt="Healthcare on a mobile device"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Features Below Image */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-center mt-4 pt-8">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer text-center w-40">
                  <span className="text-3xl">📞</span>
                  <p className="text-sm font-semibold text-gray-700 mt-2">Video Call a Doctor</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer w-40 text-center">
                  <span className="text-3xl">❤️</span>
                  <p className="text-sm font-semibold text-gray-700 mt-2">Track Your Health</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer w-40 text-center">
                  <span className="text-3xl">🧠</span>
                  <p className="text-sm font-semibold text-gray-700 mt-2">AI Disease Predictor</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer w-40 text-center">
                  <span className="text-3xl">💓</span>
                  <p className="text-sm font-semibold text-gray-700 mt-2">Heart Risk Checker</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Your Health, Our Mission
            </h2>
            <p className="text-lg text-gray-600">
              At **Best Health**, we are dedicated to providing accessible, high-quality, and
              personalized healthcare services to everyone. Our platform connects you with a
              vast network of certified professionals who are available 24/7 to help you
              manage your health journey.
            </p>
            <p className="text-md text-gray-500 italic">
              "Health is a state of complete physical, mental and social well-being, and not
              merely the absence of disease or infirmity."
            </p>
            <Link
              to="/about"
              className="mt-4 inline-block text-lg font-semibold text-lime-600 hover:text-lime-700 transition-colors"
            >
              Learn More About Our Story &rarr;
            </Link>
          </div>
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
              <img
                src={aboutImage}
                alt="About us"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            How It <span className="text-teal-500">Works</span>
          </h2>
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 mt-16">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 hidden lg:block"></div>
            {howItWorksSteps.map(([number, title, desc], index) => (
              <div
                key={index}
                className="relative z-10 w-full lg:w-1/3 p-6 bg-white rounded-xl shadow-lg border border-blue-100 transform transition-transform duration-300 hover:scale-105"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                  {number}
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Our Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            Our <span className="text-teal-500">Comprehensive Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
            We offer a wide range of services designed to meet your every healthcare need, from routine check-ups to specialized consultations. Our platform ensures that you receive the best care from anywhere.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '💊', title: 'Medication Management', desc: 'Keep track of your prescriptions and receive reminders.' },
              { icon: '🧠', title: 'Mental Health Support', desc: 'Connect with licensed therapists for confidential sessions.' },
              { icon: '🥗', title: 'Nutritional Counseling', desc: 'Personalized diet plans from certified nutritionists.' },
              { icon: '🏃‍♂️', title: 'Fitness Coaching', desc: 'Achieve your fitness goals with expert guidance.' },
              { icon: '👩‍🔬', title: 'AI Disease Analysis', desc: 'Receive expert doctor suggestions from your reports' },
              { icon: '👶', title: 'Pediatric Care', desc: 'Access specialized care for your children\'s health needs.' },
            ].map((service, index) => (
              <div
                key={index}
                ref={(el) => (boxesRef.current[index] = el)}
                data-index={index}
                className={`bg-gray-100 p-8 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-700 ease-in-out ${
                  visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } hover:scale-105`}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* Doctor Section */}
      <section id="for-doctors" className="py-16 text-center bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Are You a Doctor?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Join our network of certified healthcare professionals and connect with thousands of patients.
          Get your own dashboard, manage appointments, and grow your practice online.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {[
            ['📅', 'Manage Appointments', 'Easily view and handle patient bookings.'],
            ['💬', 'Real-Time Chat', 'Communicate instantly with patients securely.'],
            ['🧾', 'Upload & Review Reports', 'Access and review patient test results quickly.'],
          ].map(([icon, title, desc], index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md transform transition hover:-translate-y-2 hover:shadow-xl border border-gray-200"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
        <Link
          to="/signup"
          className="inline-flex items-center justify-center bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          👨‍⚕️ Join as Doctor
        </Link>
      </section>





      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            What Our <span className="text-lime-400">Patients Say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform has completely changed how I manage my health. The doctors are knowledgeable, and the service is incredibly convenient.",
                name: "— Sarah J.",
              },
              {
                quote: "Booking an appointment and getting a consultation was so easy. I was able to connect with a specialist right from my home.",
                name: "— David K.",
              },
              {
                quote: "I feel much more in control of my health with the health tracker. The secure messaging feature is a game-changer.",
                name: "— Priya S.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-100 p-8 rounded-xl shadow-lg border border-gray-200 transform transition-transform hover:scale-105 duration-300">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>







      {/* Stats / Our Impact Section */}
      <section id="our-impact" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Our <span className="text-purple-600">Impact</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              ['24/7', 'Access care anytime with our round-the-clock services.'],
              ['1M+', 'Trusted by over 1 million patients worldwide.'],
              ['500+', 'Partnered with over 500 top healthcare providers.'],
            ].map(([title, desc], index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg transform transition hover:-translate-y-2 hover:shadow-xl border border-gray-200"
              >
                <h3 className="text-3xl font-bold text-purple-600 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 md:px-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Best HEALTH</h3>
            <p className="text-sm text-gray-400">Your trusted partner in healthcare. Providing accessible, high-quality, and personalized care for everyone.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about-us" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#for-doctors" className="text-gray-400 hover:text-white transition-colors">For Doctors</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm text-gray-400">123 Health Blvd, Wellness City, 56789</p>
            <p className="text-sm text-gray-400 mt-1">info@besthealth.com</p>
            <p className="text-sm text-gray-400 mt-1">(123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Best HEALTH. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}