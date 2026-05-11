package com.mzansirides.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String status = "pending_approval";

    @Column(name = "checkout_date", nullable = false)
    private LocalDate checkoutDate;

    @Column(name = "car_name")
    private String carName;

    @Column private String phone;
    @Column private String email;

    @Column(name = "pickup_type")
    private String pickupType = "SELF";

    @Column(name = "pickup_address")
    private String pickupAddress;

    @Column(name = "pickup_lat")
    private Double pickupLat;

    @Column(name = "pickup_lng")
    private Double pickupLng;

    @Column(name = "payment_status")
    private String paymentStatus = "UNPAID";

    @Column(name = "payment_ref")
    private String paymentRef;

    @Column(name = "payment_amount")
    private Integer paymentAmount;

    @Column private String extras;

    @Column(name = "auto_approved")
    private Boolean autoApproved;

    @Column(name = "booking_token")
    private String bookingToken;

    @Column(name = "receipt_number")
    private String receiptNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "checkout_time")
    private String checkoutTime;

    @Column(name = "dropoff_time")
    private String dropoffTime;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "rejected_by")
    private String rejectedBy;

    public Booking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { this.customerName = v; }
    public String getCity() { return city; }
    public void setCity(String v) { this.city = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public LocalDate getCheckoutDate() { return checkoutDate; }
    public void setCheckoutDate(LocalDate v) { this.checkoutDate = v; }
    public String getCarName() { return carName; }
    public void setCarName(String v) { this.carName = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPickupType() { return pickupType; }
    public void setPickupType(String v) { this.pickupType = v; }
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String v) { this.pickupAddress = v; }
    public Double getPickupLat() { return pickupLat; }
    public void setPickupLat(Double v) { this.pickupLat = v; }
    public Double getPickupLng() { return pickupLng; }
    public void setPickupLng(Double v) { this.pickupLng = v; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String v) { this.paymentStatus = v; }
    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String v) { this.paymentRef = v; }
    public Integer getPaymentAmount() { return paymentAmount; }
    public void setPaymentAmount(Integer v) { this.paymentAmount = v; }
    public String getExtras() { return extras; }
    public void setExtras(String v) { this.extras = v; }
    public Boolean getAutoApproved() { return autoApproved; }
    public void setAutoApproved(Boolean v) { this.autoApproved = v; }
    public String getBookingToken() { return bookingToken; }
    public void setBookingToken(String v) { this.bookingToken = v; }
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String v) { this.receiptNumber = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime v) { this.approvedAt = v; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime v) { this.paidAt = v; }
    public String getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(String v) { this.checkoutTime = v; }
    public String getDropoffTime() { return dropoffTime; }
    public void setDropoffTime(String v) { this.dropoffTime = v; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String v) { this.approvedBy = v; }
    public String getRejectedBy() { return rejectedBy; }
    public void setRejectedBy(String v) { this.rejectedBy = v; }
}
