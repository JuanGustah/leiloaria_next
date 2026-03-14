"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Password confirmation is required";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      router.push("/auth/login?registered=true");
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "An error occurred"
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {generalError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 border border-red-200">
          {generalError}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="John Doe"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-[#F2A2A9] focus:ring-[#F2A2A9]"
              : "border-[#414059] focus:ring-[#635EF2]"
          }`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-[#F2A2A9] focus:ring-[#F2A2A9]"
              : "border-[#414059] focus:ring-[#635EF2]"
          }`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-[#F2A2A9] focus:ring-[#F2A2A9]"
              : "border-[#414059] focus:ring-[#635EF2]"
          }`}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Password must be at least 8 characters long
        </p>
      </div>

      <div>
        <label
          htmlFor="passwordConfirm"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="••••••••"
          className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.passwordConfirm
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#02A676]"
          }`}
          disabled={isLoading}
        />
        {errors.passwordConfirm && (
          <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>
        )}
      </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-[#635EF2] text-white font-medium rounded-lg hover:bg-[#F2A2A9] focus:outline-none focus:ring-2 focus:ring-[#635EF2] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
        {isLoading ? "Creating account..." : "Sign up"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-[#635EF2] hover:text-[#F2A2A9]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
