import { useEffect, useRef, useState } from 'react';


// About Page Content
const aboutSections = [
  {
    title: 'Our Mission',
    content:
      'To make quality healthcare accessible and affordable to all through technology.',
    icon: '🎯',
  },
  {
    title: 'Our Story',
    content:
      'Born out of a real need for fast and trustworthy medical access, AiSmartHealthcare was inspired by personal experiences and a vision to connect patients with doctors seamlessly using modern tech.',
    icon: '📖',
  },
  {
    title: 'Our Team',
    content:
      'We’re a passionate team of developers, healthcare experts, and AI enthusiasts working to revolutionize how people experience healthcare online.',
    icon: '👥',
  },
  {
    title: 'Tech Behind the Platform',
    content:
      'Built using React, Node.js, and MongoDB. Secured, scalable, and powered by AI/ML — including features like real-time chat, health tracking, and smart recommendations.',
    icon: '💻',
  },
];

export default function AboutPage() {
  const sectionRef = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, idx])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">ℹ️ About AiSmartHealthcare</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
          Discover who we are, why we exist, and how we’re changing healthcare with technology.
        </p>

        <div className="space-y-12">
          {aboutSections.map((section, index) => (
            <div
              key={index}
              ref={(el) => (sectionRef.current[index] = el)}
              data-index={index}
              className={`transition-all duration-700 ease-in-out transform px-6 py-10 bg-gray-50 rounded-xl shadow-md
                ${
                  visible.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
            >
              <div className="text-5xl mb-4">{section.icon}</div>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3">{section.title}</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 bg-blue-50 rounded-xl p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📞 Contact Us</h2>
          <p className="text-gray-700 mb-4">
            For support, queries, or collaboration, reach out to us:
          </p>
          <ul className="text-gray-800 text-md space-y-2">
            <li>📧 Email: <a href="mailto:support@aismhealth.com" className="text-blue-600 hover:underline">support@aismhealth.com</a></li>
            <li>💬 WhatsApp: <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">+91 12345 67890</a></li>
            <li>🔗 LinkedIn: <a href="https://linkedin.com/company/aismhealth" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/company/aismhealth</a></li>
            <li>📄 Support Form: <a href="/contact" className="text-blue-600 hover:underline">Submit a ticket</a></li>
          </ul>
        </div>

        <footer className="mt-16 text-sm text-gray-500">
          &copy; 2025 AiSmartHealthcare • All rights reserved
        </footer>
      </div>
    </section>
  );
}
