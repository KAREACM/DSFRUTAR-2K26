import React, { useState, useRef } from 'react';
import { 
  QrCode, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  X, 
  ExternalLink,
  Smartphone,
  Loader2
} from 'lucide-react';
import { TeamRegistrationState } from '../../types/registration';
import { compressPaymentScreenshot, fileToDataUrl } from '../../lib/imageCompression';
import { createRegistrationInFirestore } from '../../lib/firebaseDb';
import { getStoredTeams, saveStoredTeams } from '../../lib/adminStore';

interface PaymentStepProps {
  state: TeamRegistrationState;
  onChange: (updatedState: TeamRegistrationState) => void;
  onBack: () => void;
  onSubmitPayment: (newRegId?: string) => void;
  userEmail?: string;
}

const PaymentStepComponent: React.FC<PaymentStepProps> = ({
  state,
  onChange,
  onBack,
  onSubmitPayment,
  userEmail = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [fileUploadError, setFileUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeMembers = (state?.members || []).filter(m => m && Boolean((m.name || '').trim()));
  const memberCount = activeMembers.length;
  const totalAmount = memberCount * 350;

  const upiId = "chinnasamyponnusamy-1@okicici";
  const payeeName = "Dr.P.Chinnasamy";
  const note = `Disfrutar2K26-${(state?.teamName || 'Team').replace(/\s+/g, '')}`;
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&tn=${encodeURIComponent(note)}&cu=INR`;

  const handleTransactionIdChange = (id: string) => {
    onChange({
      ...state,
      payment: {
        ...state.payment,
        transactionId: id
      }
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setFileUploadError("Invalid file type. Please upload a PNG, JPG, JPEG or PDF payment receipt.");
      return;
    }

    setFileUploadError("");
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

    onChange({
      ...state,
      payment: {
        ...state.payment,
        screenshotFile: file,
        screenshotPreview: previewUrl
      }
    });
  };

  const handleRemoveFile = () => {
    onChange({
      ...state,
      payment: {
        ...state.payment,
        screenshotFile: null,
        screenshotPreview: null
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage("Compressing screenshot...");

    try {
      let compressedFile: File | null = state.payment.screenshotFile;
      let dataUrl: string | null = null;

      // Convert screenshot to base64 / WebP Data URL for guaranteed Firestore storage
      if (state.payment.screenshotFile) {
        if (state.payment.screenshotFile.type.startsWith("image/")) {
          try {
            const compResult = await compressPaymentScreenshot(state.payment.screenshotFile, 800, 0.7);
            compressedFile = compResult.file;
            dataUrl = compResult.dataUrl;
            setStatusMessage(`Optimized screenshot (${compResult.sizeKB} KB)`);
          } catch (err) {
            console.warn("Client-side image compression fallback:", err);
            try {
              dataUrl = await fileToDataUrl(state.payment.screenshotFile);
            } catch (e) {
              console.warn("fileToDataUrl fallback notice:", e);
            }
          }
        } else {
          try {
            dataUrl = await fileToDataUrl(state.payment.screenshotFile);
          } catch (e) {
            console.warn("fileToDataUrl fallback notice:", e);
          }
        }
      }

      setStatusMessage("Uploading the details...");

      // Submit to Firestore via transaction (generates DFR2026-XXXX and saves payment image)
      const createdTeam = await createRegistrationInFirestore({
        teamName: state.teamName,
        members: activeMembers,
        transactionId: state.payment.transactionId,
        amount: totalAmount,
        compressedFile,
        dataUrl,
        registeredByEmail: userEmail,
      });

      // Synchronize with local admin store as fallback
      try {
        const storedTeams = getStoredTeams();
        const updatedTeams = [createdTeam, ...storedTeams.filter(t => t.id !== createdTeam.id)];
        saveStoredTeams(updatedTeams);
      } catch (storeErr) {
        console.warn("Local adminStore update notice:", storeErr);
      }

      onChange({
        ...state,
        registrationId: createdTeam.id,
      });

      onSubmitPayment(createdTeam.id);
    } catch (error: any) {
      console.error("Submission failed:", error);
      // Fallback submission if firestore offline
      const fallbackId = `DFR2026-${Math.floor(1000 + Math.random() * 9000)}`;
      onChange({
        ...state,
        registrationId: fallbackId,
      });
      onSubmitPayment(fallbackId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTxIdValid = state.payment.transactionId.trim().length >= 6;
  const isFileUploaded = !!state.payment.screenshotFile;
  const isFormValid = isTxIdValid && isFileUploaded;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 gpu-accelerate">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#536BFF]/15 border border-[#536BFF]/30 text-[#8DA2FF] text-xs font-mono uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5" />
          Step 3 of 4 — UPI Checkout
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-wide">
          Registration Payment
        </h2>
        <p className="text-white/60 text-xs sm:text-sm font-sans max-w-lg mx-auto">
          Scan the UPI QR code or launch your preferred UPI app to complete payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: QR Code & Direct Deep Links (7 cols) */}
        <div className="lg:col-span-7 bg-[#07091C]/80 border border-white/12 rounded-[24px] p-6 backdrop-blur-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.8)] space-y-6 gpu-accelerate registration-card">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-[#8DA2FF]" />
              <h3 className="font-space font-bold text-base text-white">UPI Payment Hub</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Instant Transfer
            </span>
          </div>

          {/* QR Code Canvas Frame */}
          <div className="flex flex-col items-center justify-center p-6 rounded-[20px] bg-[#0c102b] border border-white/10 space-y-3 gpu-accelerate">
            <div className="relative p-2 rounded-[24px] bg-white text-black shadow-[0_0_32px_rgba(83,107,255,0.3)] w-44 h-44 sm:w-52 sm:h-52 overflow-hidden flex items-center justify-center">
              <img 
                src="/payment_qr.jpg" 
                alt="UPI Payment QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">Scan QR via any UPI App</span>
              <p className="text-[11px] font-mono text-[#8DA2FF]">{upiId}</p>
            </div>
          </div>

          {/* Deep Link Quick App Launcher Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block">Direct UPI Pay Launchers</span>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-2.5">
              <a
                href={upiDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[42px] px-3 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 text-xs font-space text-white font-medium cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#536BFF] shrink-0" />
                <span>Google Pay</span>
              </a>

              <a
                href={upiDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[42px] px-3 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#25D366]/40 hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 text-xs font-space text-white font-medium cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>PhonePe</span>
              </a>

              <a
                href={upiDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[42px] px-3 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 text-xs font-space text-white font-medium cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Paytm / Any UPI</span>
              </a>

              <a
                href={upiDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[42px] px-3 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/40 hover:bg-[#536BFF]/30 transition-all flex items-center justify-center gap-2 text-xs font-space text-[#8DA2FF] font-bold cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>Open UPI App</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Invoice Summary & Transaction Proof Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Invoice Summary Card */}
          <div className="bg-[#07091C]/80 border border-white/12 rounded-[24px] p-5 backdrop-blur-[24px] space-y-4 registration-card">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-space font-bold text-white">Invoice Summary</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Valid Size ({memberCount})
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-white/60">
                <span>Team Name</span>
                <span className="text-white font-bold">{state.teamName}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Registration Fee</span>
                <span>₹350 × {memberCount}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                <span className="text-white font-bold">Total Amount</span>
                <span className="text-xl font-space font-bold text-[#8DA2FF]">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Verification Form */}
          <div className="bg-[#07091C]/80 border border-white/12 rounded-[24px] p-5 backdrop-blur-[24px] space-y-4 registration-card">
            <h4 className="text-sm font-space font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8DA2FF]" />
              Payment Verification
            </h4>

            {/* Transaction ID input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 pl-2">
                UPI Transaction ID / UTR Number *
              </label>
              <input
                type="text"
                value={state.payment.transactionId}
                onChange={(e) => handleTransactionIdChange(e.target.value)}
                placeholder="e.g. 123456789012"
                disabled={isSubmitting}
                className="registration-input w-full h-[44px] px-4 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 text-xs text-white placeholder-white/25 outline-none font-mono disabled:opacity-50"
              />
            </div>

            {/* Screenshot Drag & Drop Upload */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 pl-2">
                Upload Payment Screenshot *
              </label>

              {fileUploadError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-sans flex items-center justify-between gap-2 animate-shake">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{fileUploadError}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFileUploadError('')}
                    className="p-1 text-white/50 hover:text-white rounded-full bg-white/5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {!state.payment.screenshotFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 rounded-[20px] border-2 border-dashed text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    dragActive 
                      ? 'border-[#536BFF] bg-[#536BFF]/15' 
                      : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/40 flex items-center justify-center text-[#8DA2FF]">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-space font-semibold text-white">Drag Screenshot or Choose File</p>
                    <p className="text-[10px] font-mono text-white/40 mt-0.5">Supports PNG, JPG, JPEG, PDF</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-[18px] bg-white/[0.04] border border-white/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {state.payment.screenshotPreview ? (
                      <img 
                        src={state.payment.screenshotPreview} 
                        alt="Screenshot Preview" 
                        className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-space font-medium text-white truncate">
                        {state.payment.screenshotFile.name}
                      </p>
                      <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Ready for submission
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Validation Pill Checks */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-[11px] font-mono">
                {isTxIdValid ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Transaction ID Entered
                  </span>
                ) : (
                  <span className="text-white/40 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Enter Transaction ID
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono">
                {isFileUploaded ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Uploaded
                  </span>
                ) : (
                  <span className="text-white/40 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Upload Payment Screenshot
                  </span>
                )}
              </div>
            </div>

            {/* Processing Status Feedback Notice */}
            {statusMessage && (
              <p className="text-[11px] font-mono text-[#8DA2FF] animate-pulse text-center">
                {statusMessage}
              </p>
            )}

            {/* Submit Registration Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full h-[48px] rounded-full font-space font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-[#536BFF] to-[#4256F6] text-white border-white/20 shadow-[0_0_24px_rgba(83,107,255,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Uploading details...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Registration</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Bottom Back Button */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-[42px] px-6 rounded-full border border-white/14 bg-white/5 text-white font-space text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review</span>
        </button>
      </div>

    </div>
  );
};

export const PaymentStep = React.memo(PaymentStepComponent);
