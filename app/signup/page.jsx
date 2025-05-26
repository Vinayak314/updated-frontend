"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countries from "react-phone-number-input/locale/en.json"; // Use a default country list
import { useRouter } from "next/navigation"; // Import useRouter from Next.js

// Regex patterns for validation
const regex = {
  name: /^[a-zA-Z\s]{1,100}$/, // Only letters and spaces, max 100 characters
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Standard email pattern
  phone: /^\+?[1-9]\d{1,14}$/,  // E.164 phone number format
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,255}$/, // Minimum 8 characters with letters and numbers
  gstNumber: /^[A-Z0-9]{15}$/, // GST number must be 15 characters
  panNumber: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN number format (e.g., ABCDE1234F)
  iec: /^[A-Z0-9]{10}$/, // IEC can be alphanumeric, 10-50 characters
};

export default function SignupPage() {
  const router = useRouter(); // Use useRouter from Next.js

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    country: "",
    userType: "",
    gstNumber: "",
    panNumber: "",
    iec: "",
  });

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [country, setCountry] = useState("India");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showNextAfterBack, setShowNextAfterBack] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Step 2 - Validate email format (only for Step 2)
    if (step === 2 && !regex.email.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Step 4 - Validate business details (only for Step 4)
    if (step === 4) {
      // Validate name (max 100 characters, only letters and spaces)
      if (!regex.name.test(formData.name)) {
        setErrorMessage("Name must only contain letters and spaces.");
        return false;
      }

      // Validate phone number format
      const parsedPhone = parsePhoneNumberFromString(formData.phone);
      if (!parsedPhone || !parsedPhone.isValid()) {
        setErrorMessage("Please enter a valid phone number.");
        return false;
      }

      // Validate GST number
      if (formData.userType === "exporter" && formData.gstNumber && !regex.gstNumber.test(formData.gstNumber)) {
        setErrorMessage("GST number must be 15 characters long and alphanumeric in capital letters.");
        return false;
      }

      // Validate PAN number
      if (formData.userType === "exporter" && formData.panNumber && !regex.panNumber.test(formData.panNumber)) {
        setErrorMessage("PAN number must be 10 characters long in the correct format in capital letters.");
        return false;
      }

      // Validate IEC
      if (formData.iec && !regex.iec.test(formData.iec)) {
        setErrorMessage("IEC number must be alphanumeric and 10 characters long in capital letters.");
        return false;
      }
    }

    // Step 5 - Validate password, and confirm password (only for Step 5)
    if (step === 5) {
      // Validate password and confirm password
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return false;
      }

      // Validate password length
      if (!regex.password.test(formData.password)) {
        setErrorMessage("Password must be at least 8 characters long with letters and numbers.");
        return false;
      }
    }

    return true;
  };

  // Handle User Type Selection
  const handleUserTypeSelect = (value) => {
    // Set the userType value to the enum: ["Exporter", "Importer"]
    const selectedUserType = value === "exporter" ? "Exporter" : "Importer";
    setFormData({ ...formData, userType: value });
    setStep(2); // Move to Step 2 where the email is collected
    // For Exporters, set country code to +91 (India) and country to IN
    if (selectedUserType === "Exporter") {
      setCountryCode("+91");
      setCountry("IN"); // Use ISO country code for India
    } else {
      setCountryCode(""); // For Importers, no default country code
      setCountry(""); // No country selected for importers
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form before sending OTP
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Check if the email already exists in the database and send OTP if email is not registered
      const response = await axios.post("https://zecbay-backend.vercel.app/api/user/send-otp/", {
        email: formData.email,
      });

      // Check if the response contains an error (email already registered)
      if (response.data.error) {
        // If the email is already registered, show an error message
        Swal.fire({
          title: 'Email Already Registered',
          text: 'Email is already registered with us. Please use a different email.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setErrorMessage("");
        setSuccessMessage("");  // Clear any previous success messages
      } else {
        // If OTP is sent successfully (email not registered)
        const otp = response.data.otp;

        // Store OTP in localStorage
        if (otp) {
          localStorage.setItem("otp", otp);
        }
        toast.success("OTP sent successfully!");
        setOtpSent(true);
        setSuccessMessage("Please check your spam folder for OTP.");
        setErrorMessage("");
        console.log("OTP stored in localStorage:", otp); // Debug log
        setStep(3);
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === "Email is already registered") {
        Swal.fire({
          title: 'Email Already Registered',
          text: 'Email is already registered with us. Please use a different email.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        // For other errors, show them to the user
        setErrorMessage("Something went wrong. Please try again.");
        setSuccessMessage("");
        console.error("Error sending OTP:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Retrieve OTP from localStorage
      const storedOtp = localStorage.getItem('otp');
      if (!storedOtp) {
        setErrorMessage("OTP not found. Please request a new OTP.");
        setSuccessMessage("");
        setIsLoading(false);
        return;
      }

      // Compare the OTP entered by the user with the one stored in localStorage
      if (parseInt(storedOtp) !== parseInt(otp)) {
        setErrorMessage("Invalid OTP.");
        setSuccessMessage("");
      } else {
        // OTP is correct, move to Step 4 for business details
        toast.success("OTP verified successfully.");
        setSuccessMessage("");
        setErrorMessage("");
        // Send OTP verification request to the backend
      const response = await axios.post("https://zecbay-backend.vercel.app/api/user/verify-otp/", {
        email: formData.email,
        otp: storedOtp,
      });

      if (response.status === 200) {
        // Store username and userid in localStorage
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userid', response.data.userid);

        setStep(4); // Move to business details
        localStorage.removeItem('otp');
      } else {
        setErrorMessage("OTP verification failed.");
        setSuccessMessage("");
      }
    }
  } catch (error) {
    setErrorMessage("Error verifying OTP: " + error.message);
    setSuccessMessage("");
  } finally {
    setIsLoading(false);
  }
  };

  const handleBusinessDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form before sending business details
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    // Determine the country value based on userType
    const selectedCountry = formData.userType === "exporter" ? "India" : country;

    try {
      const businessDetails = {
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        iec: formData.iec,
      };
      const response = await axios.post("https://zecbay-backend.vercel.app/api/user/business-details/", {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        country: selectedCountry,
        businessDetails,
      });
      toast.success("Business details updated successfully.");
      setSuccessMessage("");
      setErrorMessage("");
      setStep(5); // Move to account creation
    } catch (error) {
      setErrorMessage("Invalid business details");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form before creating account
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://zecbay-backend.vercel.app/api/user/signup/", {
        password: formData.password,
        email: formData.email,
        userType: formData.userType,
      });
      if (response.status === 200) {
        toast.success("User registered successfully!");
        setSuccessMessage("");
        setErrorMessage("");
        window.location.href = "/login";
      } else {
        setErrorMessage(response.data.message || "Failed to save user.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error saving user: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle country code and phone number
  const handlePhoneChange = (value) => {
  if (value && typeof value === 'string') {
    const parsedNumber = parsePhoneNumberFromString(value);
    if (parsedNumber) {
      const countryCode = parsedNumber.countryCallingCode; // +91 for India, etc.
      const countryName = parsedNumber.country; // "IN" for India, etc.
      setFormData({
        ...formData,
        phone: value,
      });
      setCountry(countryName); // Set the country based on the phone number
      setCountryCode(`+${countryCode}`);
    }
  }
};

const handleCountryChange = (selectedOption) => {
  const selectedCountry = selectedOption;
  setCountry(selectedCountry);
};

const handleBackButton = () => {
  setStep(step - 1); // Go back to the previous step
  setShowNextAfterBack(true); // Show Next button after Back is pressed
};

const handleNextButton = () => {
  setStep(step + 1); // Go to the next step
  setShowNextAfterBack(false); // Hide Next button once it's clicked
};

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Link href="/" className="flex items-center text-primary hover:underline mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
          <CardDescription className="text-center">
            {step === 1 && "Select your user type"}
            {step === 2 && "Enter your email"}
            {step === 3 && "Enter OTP to verify your email"}
            {step === 4 && "Enter your business details"}
            {step === 5 && "Create your account credentials"}
          </CardDescription>
        </CardHeader>

        <CardContent>
        {step === 1 && (
            <>
              <div className="space-y-2 mb-4">
                <Label>I am an</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={handleUserTypeSelect}
                  className="grid grid-cols-2 gap-4"
                >
                <div>
                <RadioGroupItem value="exporter" id="exporter" className="peer sr-only" />
                <Label
                  htmlFor="exporter"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 w-full text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <span className="whitespace-nowrap">Indian Exporter</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="importer" id="importer" className="peer sr-only" />
                <Label
                  htmlFor="importer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 w-full text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <span className="whitespace-nowrap">Importer</span>
                </Label>
              </div>
                </RadioGroup>
              </div>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSendOTP}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleVerifyOTP}>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP sent to {formData.email}</Label>
                <Input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleBusinessDetails}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex space-x-2">
                  <PhoneInput
                    international
                    country={country}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    defaultCountry={country}
                    className="w-full border p-2"
                  />
                </div>
              </div>

              {formData.userType === "importer" && (
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(countries).map((key) => (
                      <SelectItem key={key} value={key}>
                        {countries[key]} ({key})
                      </SelectItem>
                    ))}
                </SelectContent>
                </Select>
              </div>
              )}

              {formData.userType === "exporter" && (
              <div className="hidden">
                {/* Exporter doesn't need to select country */}
                <Input value="India" readOnly name="country" />
              </div>
              )}

              {formData.userType === "exporter" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gst-number">GST Number</Label>
                  <Input
                    id="gst-number"
                    type="text"
                    required
                    value={formData.gstNumber}
                    onChange={handleChange}
                    name="gstNumber"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan-number">PAN Number</Label>
                  <Input
                    id="pan-number"
                    type="text"
                    required
                    value={formData.panNumber}
                    onChange={handleChange}
                    name="panNumber"
                  />
                </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="iec">Import Export Code</Label>
                <Input
                  id="iec"
                  type="text"
                  required
                  value={formData.iec}
                  onChange={handleChange}
                  name="iec"
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Updating..." : "Save Business Details"}
              </Button>
            </form>
          )}

          {step === 5 && (
            <form onSubmit={handleCreateAccount}>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username || localStorage.getItem('username')}
                  onChange={handleChange}
                  name="username"
                  readOnly // Make the input field non-editable
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userid">UserID</Label>
                <Input
                  id="userid"
                  type="text"
                  required
                  value={formData.userid || localStorage.getItem('userid')}
                  onChange={handleChange}
                  name="userid"
                  readOnly // Make the input field non-editable
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </form>
          )}

          {/* Back Button */}
          {step !== 1 && (
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  className="w-full bg-transparent text-muted border border-muted hover:bg-transparent hover:text-primary"
                  onClick={handleBackButton} // Go back to the previous step
                >
                  Back
                </Button>
              </div>
          )}

          {/* Next Button */}
          {showNextAfterBack && (
            <div className="mt-4 text-center">
              <Button
                type="button"
                className="w-full bg-transparent text-muted border border-muted hover:bg-transparent hover:text-primary"
                onClick={handleNextButton} // Handle next button click
              >
                Next
              </Button>
            </div>
          )}

          {errorMessage && (
            <div className="text-red-500 text-center mt-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-center mt-4">{successMessage}</div>
          )}
          <ToastContainer />
        </CardContent>
      </Card>
    </div>
  );
}
