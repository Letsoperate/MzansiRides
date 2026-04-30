import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import "../styles/admin.css";

export default function PaymentPage() {
  const { token } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "MzansiRides - Payment";
    fetch("/api/public/booking/" + token)
      .then(r => r.json())
      .then(d => { if (d.id) setBooking(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function handlePay() {
    setPaying(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2500));
    const ref = "MZR-PAY-" + Date.now().toString(36).toUpperCase();
    try {
      const res = await fetch("/api/public/booking/" + token + "/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentRef: ref, amount: booking.paymentAmount || 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        setReceipt(data);
        setShowReceipt(true);
      }
    } catch (e) {
      alert("Payment simulation complete. Reference: " + ref);
      setShowReceipt(true);
    }
    setPaying(false);
  }

  if (loading) return (
    <div><SectionHeader title="PAYMENT" /><div className="admin-loading">Loading booking...</div></div>
  );

  if (!booking) return (
    <div><SectionHeader title="PAYMENT" /><div className="signin-form constant-margin sec-bg" style={{ textAlign: "center", padding: "2rem" }}>
      <p className="standard-fz" style={{ color: "#e94560" }}>Booking not found.</p>
      <Link to="/home"><button className="pri-bg transition standard-weight header-margin">Home</button></Link>
    </div></div>
  );

  if (booking.paymentStatus === "PAID") return (
    <div><SectionHeader title="PAYMENT" /><div className="signin-form constant-margin sec-bg" style={{ textAlign: "center", padding: "2rem" }}>
      <i className="fa-solid fa-circle-check" style={{ fontSize: "3rem", color: "#4ade80" }}></i>
      <p className="standard-fz" style={{ marginTop: "1rem" }}>Already Paid</p>
      <p className="min-font sec-font-clr">Receipt: {booking.receiptNumber || "N/A"}</p>
      <Link to="/home"><button className="pri-bg transition standard-weight header-margin">Home</button></Link>
    </div></div>
  );

  return (
    <div>
      <SectionHeader title="COMPLETE PAYMENT" />
      <div className="signin-form constant-margin sec-bg">
        {!showReceipt ? (
          <>
            <p className="standard-fz header-margin align sec-font sec-font-clr">Confirm Your Booking</p>
            <div className="payment-details">
              <div className="payment-row"><span>Customer</span><strong>{booking.customerName}</strong></div>
              <div className="payment-row"><span>Vehicle</span><strong>{booking.carName || "N/A"}</strong></div>
              <div className="payment-row"><span>City</span><strong>{booking.city}</strong></div>
              <div className="payment-row"><span>Date</span><strong>{booking.checkoutDate}</strong></div>
              <div className="payment-row"><span>Pickup</span><strong>{booking.pickupType === "DELIVERY" ? "Delivery" : "Self Collect"}</strong></div>
              {booking.pickupAddress && <div className="payment-row"><span>Address</span><strong>{booking.pickupAddress}</strong></div>}
              {booking.extras && <div className="payment-row"><span>Extras</span><strong>{booking.extras}</strong></div>}
              <div className="payment-total">
                <span>Total Due</span>
                <strong>R{booking.paymentAmount || 0}</strong>
              </div>
            </div>
            <button onClick={handlePay} disabled={paying} className="pri-bg transition standard-weight header-margin" style={{ width: "100%", fontSize: "1.1rem" }}>
              {paying ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</> : <>Pay R{booking.paymentAmount || 0}</>}
            </button>
            <p className="min-font sec-font-clr align" style={{ marginTop: "0.5rem" }}>Demo payment — no real charges</p>
          </>
        ) : (
          <ReceiptSlip booking={booking} receipt={receipt || booking} />
        )}
      </div>
    </div>
  );
}

function ReceiptSlip({ booking, receipt }) {
  return (
    <div className="receipt-container">
      <div className="receipt-success-check">
        <svg viewBox="0 0 100 100" className="receipt-checkmark">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#4ade80" strokeWidth="4" className="check-circle" />
          <polyline points="28,50 45,68 72,35" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-poly" />
        </svg>
      </div>
      <h2 style={{ color: "#4ade80", margin: "0.5rem 0" }}>Payment Successful!</h2>
      <div className="receipt-slip">
        <div className="receipt-slip-header">
          <h3>MzansiRides</h3>
          <p>Official Receipt</p>
        </div>
        <table className="receipt-table">
          <tbody>
            <tr><td>Receipt No</td><td className="mono">{receipt.receiptNumber || booking.receiptNumber || "N/A"}</td></tr>
            <tr><td>Payment Ref</td><td className="mono">{receipt.paymentRef || booking.paymentRef || "N/A"}</td></tr>
            <tr><td>Customer</td><td><strong>{booking.customerName}</strong></td></tr>
            <tr><td>Vehicle</td><td><strong>{booking.carName}</strong></td></tr>
            <tr><td>Amount Paid</td><td className="mono" style={{ color: "#4ade80", fontSize: "1.2rem" }}>R{receipt.paymentAmount || booking.paymentAmount || 0}</td></tr>
            <tr><td>Date</td><td>{receipt.paidAt ? new Date(receipt.paidAt).toLocaleDateString() : new Date().toLocaleDateString()}</td></tr>
          </tbody>
        </table>
        <div className="receipt-barcode">
          █▌▐█▌▐█▌▐█▌▐█▌▐█▌▐█▌▐█▌▐█▌
        </div>
        <p className="receipt-footer">Thank you for choosing MzansiRides</p>
      </div>
      <Link to="/home"><button className="pri-bg transition standard-weight header-margin" style={{ width: "100%" }}>Continue</button></Link>
    </div>
  );
}
