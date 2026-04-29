/**
 * form.js — Arham Coaching Classes
 * Form validation + Google Sheets submission + success toast
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initEnquiryForm();
  initContactForm();
});

/*
  Google Apps Script setup:
  1) Create a sheet with headers in first row (for example):
     timestamp | formType | name | phone | email | subject | message | studentName | parentName | studentClass | board | source
  2) Deploy Apps Script as Web App with access: Anyone.
  3) Paste Web App URL below.
*/
const GOOGLE_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwg720ZU2zS4_5XPlGJwxiQOaJV1tHtA8FOy_oSJRUnIePUYJutfmoaWeBE11OozcmH/exec';


/* ============================================================
   ENQUIRY FORM (admissions.html)
   ============================================================ */
function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;
  form.dataset.formType = 'enquiry';
  attachGoogleSheetSubmit(form, '✅ Thank you! We\'ll contact you within 24 hours.');

  // Real-time validation
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });
}

/* ============================================================
   CONTACT FORM (contact.html)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.dataset.formType = 'contact';
  attachGoogleSheetSubmit(form, '✅ Message sent! We\'ll be in touch shortly.');
}

async function submitToGoogleSheet(payload) {
  const endpoint = (GOOGLE_SCRIPT_WEBAPP_URL || '').trim();
  if (!endpoint || endpoint.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE')) {
    throw new Error('Google Apps Script URL missing');
  }

  const body = new URLSearchParams({
    payload: JSON.stringify(payload),
    submittedAt: payload.timestamp || new Date().toISOString(),
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body.toString(),
    mode: 'no-cors',
  });
  return response;
}

function attachGoogleSheetSubmit(form, successMessage) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('.submit-btn');
    setLoading(btn, true);

    try {
      const payload = buildPayload(form);
      await submitToGoogleSheet(payload);
      showToast(successMessage, 'success');
      form.reset();
      clearAllErrors(form);
    } catch (error) {
      if (error.message === 'Google Apps Script URL missing') {
        showToast('⚠️ Add your Google Apps Script Web App URL in js/form.js.', 'error');
      } else {
        showToast('⚠️ Could not submit right now. Please call 9468608280.', 'error');
      }
    } finally {
      setLoading(btn, false);
    }
  });
}

function buildPayload(form) {
  const formData = new FormData(form);
  const get = (key) => (formData.get(key) || '').toString().trim();

  return {
    timestamp: new Date().toISOString(),
    formType: form.dataset.formType || 'general',
    name: get('name'),
    phone: get('phone'),
    email: get('email'),
    subject: get('subject'),
    message: get('message'),
    studentName: get('studentName'),
    parentName: get('parentName'),
    studentClass: get('studentClass'),
    board: get('board'),
    source: get('source'),
  };
}

/* ============================================================
   VALIDATION HELPERS
   ============================================================ */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('.form-control[required]').forEach(input => {
    if (!validateField(input)) valid = false;
  });
  // Also validate non-required fields with patterns
  form.querySelectorAll('.form-control[data-pattern]').forEach(input => {
    if (input.value.trim() && !validateField(input)) valid = false;
  });
  return valid;
}

function validateField(input) {
  const val = input.value.trim();
  const name = input.name || input.id;
  const errorEl = input.parentElement.querySelector('.form-error');
  let message = '';

  // Required check
  if (input.hasAttribute('required') && !val) {
    message = 'This field is required.';
  }
  // Phone validation (10 digits, Indian)
  else if ((name === 'phone' || input.type === 'tel') && val) {
    if (!/^[6-9]\d{9}$/.test(val)) {
      message = 'Enter a valid 10-digit Indian mobile number.';
    }
  }
  // Email
  else if (input.type === 'email' && val) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      message = 'Enter a valid email address.';
    }
  }

  if (message) {
    input.classList.add('error');
    input.classList.remove('success');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
    return false;
  } else {
    input.classList.remove('error');
    if (val) input.classList.add('success');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
    return true;
  }
}

function clearAllErrors(form) {
  form.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('error', 'success');
  });
  form.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

/* ============================================================
   UI HELPERS
   ============================================================ */
function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Submitting...';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || 'Submit';
  }
}

function showToast(message, type = 'success') {
  // Remove existing toast
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = type === 'success' ? 'var(--gold)' : '#CC0000';
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${message}</span>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    dismissToast(toast);
  });

  // Auto dismiss after 5s
  setTimeout(() => dismissToast(toast), 5000);
}

function dismissToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 400);
}
