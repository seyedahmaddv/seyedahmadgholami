'use client';
import React, { useEffect } from 'react';

const NewsletterForm = () => {
  useEffect(() => {
    // اضافه کردن اسکریپت MailerLite به صورت پویا
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
      .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
      n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
      (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
      ml('account', '1402483');
    `;
    document.head.appendChild(script);

    return () => {
      // پاکسازی در هنگام unmount
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="newsletter-container">
      <h3 className="text-xl font-bold mb-4">عضویت در خبرنامه</h3>
      <div className="ml-embedded" data-form="mnUQEJ"></div>
    </div>
  );
};

export default NewsletterForm;