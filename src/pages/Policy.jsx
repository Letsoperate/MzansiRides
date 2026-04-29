import { useContext, useEffect } from "react";

import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import "../styles/policy.css";

export default function Policy() {
  const { setDisplayHeader } = useContext(ToggleContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(true);
    document.title = "MzansiRides - Privacy Policy";
  }, []);

  return (
    <div>
      <SectionHeader title="PRIVACY POLICY" />
      <div className="policy-container constant-padding constant-margin">
        <h2 className="privacy-text standard-fz pri-font-clr align header-margin">
          At MzansiRides, we believe that the privacy and security of our
          users is of ultimate importance. Therefore we procure strict
          administrative policies to protect your privacy and security...
        </h2>
        <div className="header-margin2">
          <h2 className="privacy-title pri-font-clr standard-fz sub-header-margin">
            We Collect:
          </h2>
          <p className="privacy-text standard-fz sec-font-clr">
            Personal information like contact information(name, email address,
            phone number), Identification information (driver's license,
            passport, or other government-issued ID), Payment details (credit
            card information), Reservation history and preferences.
          </p>
        </div>
        <div className="header-margin2">
          <h2 className="privacy-title pri-font-clr standard-fz sub-header-margin">
            Usage Data:
          </h2>
          <p className="privacy-text standard-fz sec-font-clr">
            Information about your interaction with our website(pages viewed,
            features used, IP address, device information, and browser type).
          </p>
          <p className="privacy-text standard-fz sec-font-clr">
            Cookies and Google analytics data are used to improve and test our
            website. In addition, our server logs are regularly pruned.
            MzansiRides does not collect or log any traffic on its virtual
            private network.
          </p>
          <p className="privacy-text standard-fz sec-font-clr">
            If you enable location services, we may collect your precise
            location data to provide location-based services.
          </p>
        </div>
        <div className="header-margin2">
          <h2 className="privacy-title pri-font-clr standard-fz sub-header-margin">
            How We Use Your Information:
          </h2>
          <div>
            <p className="privacy-text standard-fz sec-font-clr">
              We use the collected information for the following purposes:
            </p>
            <ul
              className="sec-font-clr standard-fz privacy-text"
              style={{ marginLeft: "1.3em" }}
            >
              <li>To facilitate car reservations, pickups, and returns.</li>
              <li>
                To communicate with you about your bookings and rental details.
              </li>
              <li>To process payments and refunds.</li>
              <li>
                To provide customer support and respond to your inquiries.
              </li>
              <li>
                To send promotional offers, newsletters, and updates with your
                consent.
              </li>
              <li>
                To personalize your experience and offer tailored promotions.
              </li>
              <li>
                To prevent fraud, unauthorized access, or misuse of our
                services.
              </li>
            </ul>
          </div>
        </div>
        <div className="header-margin2">
          <h2 className="privacy-title pri-font-clr standard-fz sub-header-margin">
            Disclosure Of Information:
          </h2>
          <p className="privacy-text standard-fz sec-font-clr">
            We may share your information with third-party service providers who
            assist us in delivering our services (e.g., payment processors, data
            analytics), Partners and affiliates with whom we collaborate to
            offer additional services or promotions and Law enforcement or
            government agencies when required by law or to protect our legal
            interests.
          </p>
        </div>
        <div className="header-margin2">
          <h2 className="privacy-title pri-font-clr standard-fz sub-header-margin">
            Your Rights And Choices:
          </h2>
          <p className="privacy-text standard-fz sec-font-clr">
            You have the rights to Access, correct, or update your personal
            information through your account settings, Opt-out of marketing
            communications by following the unsubscribe instructions provided in
            emails.
          </p>
        </div>
        <div className="header-margin2">
          <h2 className="privacy-title pri-font-clr standard-fz sub-header-margin">
            Data Security:
          </h2>
          <p className="privacy-text standard-fz sec-font-clr">
            We implement reasonable security measures to protect your data from
            unauthorized access, disclosure, or alteration. However, no data
            transmission over the internet is entirely secure, and we cannot
            guarantee absolute security.
          </p>
        </div>
        <div className="header-margin2">
          <h2 className="privacy-title pri-font-clr standard-fz sub-header-margin">
            Changes To Privacy Policy:
          </h2>
          <p className="privacy-text standard-fz sec-font-clr">
            We may update this Privacy Policy periodically to reflect changes in
            our practices. We will notify you of any material changes by posting
            the revised policy on our website.
          </p>
        </div>
        <p className="privacy-text sub-header-margin standard-fz sec-font-clr2 standard-weight">
          If you have questions or concerns about this Privacy Policy or your
          personal information, please contact us.
        </p>
        <p className="privacy-text standard-fz sec-font-clr standard-weight">
          By using our services, you agree to the terms of this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
