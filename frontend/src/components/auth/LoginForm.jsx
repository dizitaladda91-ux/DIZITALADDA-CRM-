import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
const navigate = useNavigate();

const { login } = useAuth();

const [loading, setLoading] = useState(false);

const [showPassword, setShowPassword] = useState(false);

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  mode: "onTouched",
});


const onSubmit = async (formData) => {

  try {

    setLoading(true);
  const response = await login(formData);

if (response.success) {

  toast.success("Welcome Back 👋");

  const role = response?.data?.user?.role || response?.user?.role;

  switch (role) {

    case "ADMIN":
      navigate("/dashboard", { replace: true });
      break;

    case "COUNSELLOR":
      navigate("/employee/dashboard", { replace: true });
      break;

    default:
      toast.error("Unauthorized Role");
      navigate("/", { replace: true });
  }
}

  } catch (error) {

    toast.error(

      error?.response?.data?.message ||

      "Login Failed"

    );

  } finally {

    setLoading(false);

  }

};

  return (

    <form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-7"
>

      {/* Email */}

      <div>

        <label className="mb-4 block text-sm font-semibold text-slate-700">

          Email Address

        </label>

        <div className="group flex h-16 items-center rounded-2xl border border-slate-300 bg-slate-50 px-5 transition-all duration-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">

          <Mail
            size={21}
            className="text-slate-400 group-focus-within:text-blue-600"
          />

          <input
  type="email"
  placeholder="admin@iemlms.com"
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email",
    },
  })}
  className="ml-4 w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
/>

{errors.email && (
  <p className="mt-2 text-sm text-red-500">
    {errors.email.message}
  </p>
)}

        </div>

      </div>

      {/* Password */}

      <div>

        <label className="mb-3 block text-sm font-semibold text-slate-700">

          Password

        </label>

        <div className="group flex h-16 items-center rounded-2xl border border-slate-300 bg-slate-50 px-5 transition-all duration-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">

          <Lock
            size={21}
            className="text-slate-400 group-focus-within:text-blue-600"
          />

          <input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  {...register("password", {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  })}
  className="ml-4 w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
/>

{errors.password && (
  <p className="mt-2 text-sm text-red-500">
    {errors.password.message}
  </p>
)}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 transition hover:text-blue-600"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

      </div>

      {/* Remember */}

      <div className="flex items-center justify-between">

        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">

          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />

          Remember Me

        </label>

        <button
          type="button"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >

          Forgot Password?

        </button>

      </div>

      {/* Login Button */}

      <button
  type="submit"
  disabled={loading}
  className="flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      <span>Signing In...</span>
    </div>
  ) : (
    "Sign In"
  )}
</button>

      {/* Divider */}

      <div className="relative">

        <div className="absolute left-0 top-1/2 w-full border-t border-slate-200"></div>

        <div className="relative flex justify-center">

          <span className="bg-white px-4 text-sm text-slate-400">

            Secure Login

          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="text-center">

        <p className="text-sm text-slate-500">

          © 2026 IEM LMS

        </p>

        <p className="mt-2 text-xs text-slate-400">

          Education CRM & Learning Management Platform

        </p>

      </div>

    </form>

  );

};

export default LoginForm;