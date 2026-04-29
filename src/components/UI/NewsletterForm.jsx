import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function NewsletterForm() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const inputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const email = inputRef.current.value.trim();
    if (!email) {
      toast.error("Please enter an email", { theme: "dark" });
      return;
    }
    if (!email.match(emailRegex)) {
      toast.error("Please enter a valid email", { theme: "dark" });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Subscribed! Check your email for confirmation.", { theme: "dark" });
      inputRef.current.value = "";
    } catch (err) {
      toast.error(err.message || "Failed to subscribe", { theme: "dark" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="footer-input-container">
      <input
        ref={inputRef}
        className="footer-input"
        type="email"
        placeholder="Enter your email"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="sec-font standard-fz pri-bg btn-padding scale transition"
      >
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  );
}
