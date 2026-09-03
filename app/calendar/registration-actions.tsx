"use client";

import { useEffect, useState } from "react";

const contactEmail = "team@beiyongecc.org";

export default function RegistrationActions({
  registrationUrl,
  registrationQrCode,
}: {
  registrationUrl?: string;
  registrationQrCode?: string;
}) {
  const [openModal, setOpenModal] = useState<"consultation" | "registration" | null>(null);
  const hasRegistration = Boolean(registrationUrl || registrationQrCode);

  useEffect(() => {
    if (!openModal) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenModal(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openModal]);

  return (
    <>
      <div className="event-booking-actions">
        <button
          className="button event-consult-button"
          onClick={() => setOpenModal("consultation")}
          type="button"
        >
          咨询
        </button>
        {hasRegistration ? (
          <button
            className="button button-primary event-registration-button"
            onClick={() => setOpenModal("registration")}
            type="button"
          >
            报名
          </button>
        ) : (
          <span
            aria-disabled="true"
            className="button button-primary event-registration-button is-disabled"
            title="尚未填写报名链接"
          >
            报名
          </span>
        )}
      </div>

      {openModal === "consultation" ? (
        <div
          aria-label="活动咨询方式"
          aria-modal="true"
          className="consultation-modal"
          onClick={() => setOpenModal(null)}
          role="dialog"
        >
          <div
            className="consultation-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="关闭咨询窗口"
              className="consultation-modal-close"
              onClick={() => setOpenModal(null)}
              type="button"
            >
              ×
            </button>
            <p className="eyebrow">CONTACT ECC</p>
            <h2>活动咨询</h2>
            <p>如需了解活动安排、报名或退款信息，请通过邮箱联系我们。</p>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
        </div>
      ) : null}

      {openModal === "registration" ? (
        <div
          aria-label="选择活动报名方式"
          aria-modal="true"
          className="consultation-modal"
          onClick={() => setOpenModal(null)}
          role="dialog"
        >
          <div
            className="consultation-modal-card registration-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="关闭报名窗口"
              className="consultation-modal-close"
              onClick={() => setOpenModal(null)}
              type="button"
            >
              ×
            </button>
            <p className="eyebrow">REGISTRATION</p>
            <h2>活动报名</h2>
            {registrationQrCode ? (
              <figure className="registration-qr">
                <img src={registrationQrCode} alt="活动报名二维码" />
                <figcaption>请使用微信扫描二维码报名</figcaption>
              </figure>
            ) : null}
            {registrationUrl ? (
              <a href={registrationUrl} rel="noreferrer" target="_blank">
                前往报名页面 ↗
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
