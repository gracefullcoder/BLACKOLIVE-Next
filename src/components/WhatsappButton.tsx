import Image from 'next/image';

function WhatsAppButton() {
  const phoneNumber = "+917211166616"; 
  const message = encodeURIComponent("Hello! I would like to inquire about your services.");

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-10 bottom-12 right-12 max-md:bottom-8 max-md:right-8"
      aria-label="Chat with us on WhatsApp"
    >
      <Image
        src="/assets/whatsapp.png"
        alt="WhatsApp Logo"
        height={64}
        width={64}
        className="w-16 h-16 max-md:w-12 max-md:h-12"
      />
    </a>
  );
}

export default WhatsAppButton;
