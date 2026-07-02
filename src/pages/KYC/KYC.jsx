/* =========================================================
   KYC.jsx — KYC Verification Page
   Phase 2 — Final checkpoint before Dashboard

   Centered glassmorphism card with:
   - Full Name, Phone, Document Upload
   - Simulated verification with progress animation
   - Success celebration with redirect to /dashboard
   ========================================================= */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  User,
  Phone,
  Upload,
  X,
  Check,
  AlertCircle,
  Lock,
  FileImage,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';
import { ROUTES, ECONOMY } from '../../utils/constants';

import FloatingParticles from '../Login/FloatingParticles';
import './KYC.css';

/* ─── Animation Variants ──────────────────────────────────── */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

/* ─── Validators ──────────────────────────────────────────── */

function validateFullName(name) {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

function validatePhone(phone) {
  if (!phone.trim()) return 'Phone number is required';
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return 'Enter a valid 10-digit phone number';
  return '';
}

/* ─── Helpers ─────────────────────────────────────────────── */

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Redirect delay after success ────────────────────────── */
const SUCCESS_REDIRECT_DELAY = 2500;

/* ─── KYC Component ──────────────────────────────────────── */

export default function KYC() {
  const { user, completeKYC } = useAuth();
  const navigate = useNavigate();

  // If already verified, skip to dashboard
  useEffect(() => {
    if (user?.kycStatus === 'verified') {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user?.kycStatus, navigate]);

  // Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  // Verification state machine: 'idle' | 'verifying' | 'success'
  const [stage, setStage] = useState('idle');

  // Drag state
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef(null);

  /* ─── Change handlers ───────────────────────────────────── */

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: '' };
    });
    if (formError) setFormError('');
  }, [formError]);

  const handleNameChange = useCallback((e) => {
    setFullName(e.target.value);
    clearError('fullName');
  }, [clearError]);

  const handlePhoneChange = useCallback((e) => {
    // Allow only digits, spaces, dashes
    const value = e.target.value.replace(/[^\d\s-]/g, '');
    setPhone(value);
    clearError('phone');
  }, [clearError]);

  /* ─── File handlers ─────────────────────────────────────── */

  const processFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    // Validate type
    if (!selectedFile.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, file: 'Please upload an image file (JPG, PNG, etc.)' }));
      return;
    }

    // Validate size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'File size must be less than 10MB' }));
      return;
    }

    setFile(selectedFile);
    clearError('file');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  }, [clearError]);

  const handleFileChange = useCallback((e) => {
    processFile(e.target.files[0]);
  }, [processFile]);

  const handleRemoveFile = useCallback((e) => {
    e.stopPropagation();
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  /* ─── Drag & Drop ───────────────────────────────────────── */

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  }, [processFile]);

  /* ─── Submit ─────────────────────────────────────────────── */

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate
    const nameErr = validateFullName(fullName);
    const phoneErr = validatePhone(phone);
    const fileErr = !file ? 'Please upload a document' : '';

    if (nameErr || phoneErr || fileErr) {
      setErrors({
        fullName: nameErr,
        phone: phoneErr,
        file: fileErr,
      });
      return;
    }

    setErrors({});
    setFormError('');

    // Step 1: Verifying
    setStage('verifying');

    // Simulate verification duration from constants
    await new Promise((resolve) =>
      setTimeout(resolve, ECONOMY.KYC_VERIFICATION_DURATION)
    );

    // Step 2: Success
    completeKYC({
      fullName: fullName.trim(),
      phone: phone.trim(),
      documentName: file.name,
      verifiedAt: Date.now(),
    });

    setStage('success');

    // Step 3: Redirect to dashboard
    setTimeout(() => {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }, SUCCESS_REDIRECT_DELAY);
  }, [fullName, phone, file, completeKYC, navigate]);

  /* ─── Computed ───────────────────────────────────────────── */

  const isFormValid = fullName.trim().length >= 2
    && phone.replace(/\D/g, '').length === 10
    && file !== null;

  /* ─── Upload zone classes ────────────────────────────────── */

  const uploadZoneClasses = [
    'kyc-upload__zone',
    isDragActive && 'kyc-upload__zone--drag-active',
    file && 'kyc-upload__zone--has-file',
    errors.file && !file && 'kyc-upload__zone--error',
  ].filter(Boolean).join(' ');

  /* ─── Render ─────────────────────────────────────────────── */

  return (
    <motion.div
      className="kyc-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background */}
      <div className="kyc-page__bg" />
      <FloatingParticles count={14} />

      {/* ── KYC Card ── */}
      <motion.div
        className="kyc-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Verifying Overlay ── */}
        <AnimatePresence>
          {stage === 'verifying' && (
            <motion.div
              className="kyc-verifying"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="verifying"
            >
              <motion.div
                className="kyc-verifying__spinner"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />

              <motion.p
                className="kyc-verifying__text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Verifying your details…
              </motion.p>

              <motion.p
                className="kyc-verifying__subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                This won't take long
              </motion.p>

              <motion.div
                className="kyc-verifying__progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <motion.div
                  className="kyc-verifying__progress-bar"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: ECONOMY.KYC_VERIFICATION_DURATION / 1000,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Success Overlay ── */}
        <AnimatePresence>
          {stage === 'success' && (
            <motion.div
              className="kyc-success"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="success"
            >
              {/* Glowing checkmark */}
              <motion.div style={{ position: 'relative' }}>
                <motion.div
                  className="kyc-success__icon"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <Check size={36} strokeWidth={3} />
                </motion.div>

                {/* Expanding glow ring */}
                <motion.div
                  className="kyc-success__glow"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{
                    duration: 1,
                    delay: 0.3,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>

              <motion.h3
                className="kyc-success__title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                Verification Successful
              </motion.h3>

              <motion.p
                className="kyc-success__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Welcome to the EcoPay ecosystem.
              </motion.p>

              <motion.div
                className="kyc-success__redirect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <span className="kyc-success__redirect-text">
                  Entering Dashboard
                </span>
                <div className="kyc-success__redirect-bar">
                  <motion.div
                    className="kyc-success__redirect-fill"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: SUCCESS_REDIRECT_DELAY / 1000,
                      ease: 'linear',
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Shield Icon ── */}
        <motion.div variants={itemVariants}>
          <div className="kyc-shield" id="kyc-shield-icon">
            <ShieldCheck size={28} />
            <span className="kyc-shield__pulse" aria-hidden="true" />
          </div>
        </motion.div>

        {/* ── Header ── */}
        <motion.div className="kyc-card__header" variants={itemVariants}>
          <h1 className="kyc-card__title">Verify Your Account</h1>
          <p className="kyc-card__subtitle">
            Complete a quick verification to unlock your EcoPay journey.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <form className="kyc-form" onSubmit={handleSubmit} noValidate>
          <div className="kyc-form__fields">
            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <div className={`input-group ${errors.fullName ? 'input-group--error' : ''} ${fullName ? 'input-group--filled' : ''}`}>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    id="kyc-fullname"
                    type="text"
                    className="input-field"
                    placeholder=" "
                    value={fullName}
                    onChange={handleNameChange}
                    disabled={stage !== 'idle'}
                    autoComplete="name"
                  />
                  <label className="input-label" htmlFor="kyc-fullname">
                    Full Name
                  </label>
                </div>
                {errors.fullName && (
                  <motion.span
                    className="input-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.fullName}
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={itemVariants}>
              <div className={`input-group ${errors.phone ? 'input-group--error' : ''} ${phone ? 'input-group--filled' : ''}`}>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    id="kyc-phone"
                    type="tel"
                    className="input-field"
                    placeholder=" "
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={stage !== 'idle'}
                    autoComplete="tel"
                    maxLength={12}
                  />
                  <label className="input-label" htmlFor="kyc-phone">
                    Phone Number
                  </label>
                </div>
                {errors.phone && (
                  <motion.span
                    className="input-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.phone}
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Document Upload */}
            <motion.div className="kyc-upload" variants={itemVariants}>
              <span className="kyc-upload__label">Identity Document</span>

              <div
                className={uploadZoneClasses}
                id="kyc-upload-zone"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label={file ? `Uploaded: ${file.name}` : 'Upload identity document'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!file) fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="kyc-upload__input"
                  onChange={handleFileChange}
                  disabled={stage !== 'idle'}
                  tabIndex={-1}
                  style={{ display: 'none' }}
                />

                {file && filePreview ? (
                  /* ── File Preview ── */
                  <motion.div
                    className="kyc-upload__preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={filePreview}
                      alt="Document preview"
                      className="kyc-upload__preview-thumb"
                    />
                    <div className="kyc-upload__preview-info">
                      <div className="kyc-upload__preview-name">{file.name}</div>
                      <div className="kyc-upload__preview-size">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                    {stage === 'idle' && (
                      <button
                        type="button"
                        className="kyc-upload__preview-remove"
                        onClick={handleRemoveFile}
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </motion.div>
                ) : (
                  /* ── Empty State ── */
                  <>
                    <motion.div
                      className="kyc-upload__icon"
                      animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {isDragActive ? (
                        <FileImage size={22} />
                      ) : (
                        <Upload size={22} />
                      )}
                    </motion.div>
                    <span className="kyc-upload__text">
                      {isDragActive ? (
                        'Drop your file here'
                      ) : (
                        <>
                          Drag & drop or <strong>browse</strong>
                        </>
                      )}
                    </span>
                    <span className="kyc-upload__hint">
                      JPG, PNG — Max 10MB
                    </span>
                  </>
                )}
              </div>

              {errors.file && !file && (
                <motion.span
                  className="kyc-upload__error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.file}
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Form-level error */}
          {formError && (
            <motion.div
              className="kyc-form__error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              role="alert"
            >
              <AlertCircle size={16} />
              <span>{formError}</span>
            </motion.div>
          )}

          {/* Verify Button */}
          <motion.div className="kyc-form__actions" variants={itemVariants}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              id="kyc-verify-btn"
              disabled={!isFormValid || stage !== 'idle'}
              icon={ShieldCheck}
            >
              Verify & Continue
            </Button>
          </motion.div>
        </form>

        {/* Trust badge */}
        <motion.div className="kyc-trust" variants={itemVariants}>
          <Lock size={13} />
          <span className="kyc-trust__text">
            256-bit encryption · Your data is secure
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
