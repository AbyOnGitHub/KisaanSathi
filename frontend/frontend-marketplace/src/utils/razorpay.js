/**
 * Utility helper to dynamically load the official Razorpay Checkout SDK script.
 * https://checkout.razorpay.com/v1/checkout.js
 */

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If Razorpay is already available on the window object
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script tag is already in DOM
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    // Create and inject script tag
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay SDK checkout script.');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export const isRazorpayLoaded = () => {
  return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined';
};
