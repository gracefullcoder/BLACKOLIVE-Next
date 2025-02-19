"use client"
import { useState } from "react";


function ContactUs() {

  const [contactDetails, setContactDetails] = useState({ name: "", email: "", contact: null, message: "" });

  const handleDataChange = (e:any) => {
    setContactDetails((prev) => ({...prev , [e.target.name] : e.target.value}));
  }

  console.log(contactDetails);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-16">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        <p className="text-gray-600 text-center mb-8">
          Have questions or concerns? Fill out the form below and we'll get back to you soon.
        </p>
        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Bhargav Gohil"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300"
              name="name"
              onChange={handleDataChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300"
              name="email"
              onChange={handleDataChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Contact Details</label>
            <input
              type="tel"
              placeholder="7211166616"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300"
              name="contact"
              onChange={handleDataChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              rows={4}
              placeholder="Type your message here..."
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300"
              name="message"
              onChange={handleDataChange}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactUs;
