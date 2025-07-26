"use client";
import { contactInterface, handleContactRequest } from "@/src/actions/Additional";
import { handleToast } from "@/src/utility/basic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ContactUs() {

  const [contactDetails, setContactDetails] = useState<contactInterface>({
    user: null,
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const session = useSession();
  console.log(session);

  useEffect(() => {
    let user = session?.data?.user;
    if (user) {
      const userId = user?._id;
      const email = user?.email;
      const contact = user?.contact.toString();
      const name = user.name;
      setContactDetails((prev: contactInterface) => { return { ...prev, user: userId, email, contact, name } });
    }
  }, [session])

  const validate = () => {
    const newErrors = { name: "", email: "", contact: "", message: "" };
    let isValid = true;

    if (session.data == null) {
      isValid = false;
      toast.error("Please Login First To Raise Issue!");
    }

    if (!contactDetails.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!contactDetails.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email.trim())
    ) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!contactDetails.contact.trim()) {
      newErrors.contact = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10,15}$/.test(contactDetails.contact.trim())) {
      newErrors.contact = "Enter a valid phone number (10 digits).";
      isValid = false;
    }

    if (!contactDetails.message.trim()) {
      newErrors.message = "Message is required.";
      isValid = false;
    } else if (contactDetails.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleDataChange = (e: any) => {
    let { name, value } = e.target;
    if (name == 'contact') value = (parseInt(value) || "").toString().slice(0, 10);
    setContactDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRequest = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    const response = await handleContactRequest(contactDetails);
    if (response?.success) {
      setContactDetails({ name: "", email: "", contact: "", message: "", user: null });
    }
    handleToast(response);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-16">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        <p className="text-gray-600 text-center mb-8">
          Have questions or concerns? Fill out the form below and we'll get
          back to you soon.
        </p>
        <form className="space-y-6" onSubmit={handleRequest}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:ring ${errors.name ? "border-red-500" : "focus:ring-blue-300"
                }`}
              name="name"
              value={contactDetails.name}
              onChange={handleDataChange}
              readOnly={session.data != null}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:ring ${errors.email ? "border-red-500" : "focus:ring-blue-300"
                }`}
              name="email"
              value={contactDetails.email}
              onChange={handleDataChange}
              readOnly={session?.data != null}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-gray-700 font-medium">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="7211166616"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:ring ${errors.contact ? "border-red-500" : "focus:ring-blue-300"
                }`}
              name="contact"
              value={contactDetails.contact}
              onChange={handleDataChange}
              required
            />
            {errors.contact && (
              <p className="text-sm text-red-600 mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              rows={4}
              placeholder="Type your message here..."
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:ring ${errors.message ? "border-red-500" : "focus:ring-blue-300"
                }`}
              name="message"
              value={contactDetails.message}
              onChange={handleDataChange}
              required
            ></textarea>
            {errors.message && (
              <p className="text-sm text-red-600 mt-1">{errors.message}</p>
            )}
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
