import React, { useEffect, useRef, useState } from 'react';


// Services Data
 const services = [
  {
    icon: '🩺',
    title: 'Online Consultation',
    description: 'Chat or video call with certified doctors anytime, anywhere.',
  },
  {
    icon: '📅',
    title: 'Book Appointment',
    description: 'Search & book nearby doctors based on specialization & fees.',
  },
  {
    icon: '🧪',
    title: 'Lab Test Integration',
    description: 'Upload test results, get suggestions, and connect with labs.',
  },
  {
    icon: '💬',
    title: 'Real-Time Chat',
    description: 'Secure chat with doctors after consultation.',
  },
  {
    icon: '📊',
    title: 'Health Progress Tracker',
    description: 'Visualize your health progress, medicines, and recovery.',
  },
  {
    icon: '📁',
    title: 'Report Upload',
    description: 'Upload prescriptions or lab reports securely.',
  },
  {
    icon: '👨‍⚕️',
    title: 'Doctor Dashboard',
    description: 'View appointments, upload reports, and respond to patients.',
  },
  {
    icon: '🛡️',
    title: 'Admin Panel',
    description: 'Verify doctors, manage users, and monitor platform performance.',
  },
];

export default function ServicePage() {
  const cardsRef = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">
          🛠 Services We Provide
        </h1>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          AiSmartHealthcare provides comprehensive features to patients, doctors, and administrators.
          Here’s what you can expect from our platform:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              data-index={index}
              className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 transition-all transform duration-700 ease-in-out
                ${
                  visible.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }
                hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 text-md">
            🏥 Built with ❤️ by AiSmartHealthcare Team
          </p>
          <p className="text-sm text-gray-500 mt-1">Version 1.0 • All rights reserved © 2025</p>
        </div>
      </div>
    </section>
  );
}
