import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addUser } from "./api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dx90y9zdx/upload`;
const UPLOAD_PRESET = "holtback"; // Replace with your Cloudinary preset

// Validation Schema
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string().optional(),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  ssn: yup.string().matches(/^\d{3}-\d{2}-\d{4}$/, "Invalid SSN").required("SSN is required"),
  accountType: yup.string().oneOf(["Personal", "Business"]).required(),
  address: yup.string().required("Address is required"),
  amount: yup.number().default(0),
  accountNumber: yup.number().default(123456789000),
  profilePicture: yup.string().optional(),
  gender: yup.string().oneOf(["Male", "Female"]).required(),
  dob: yup.string().required("Date of Birth is required"),
  maritalStatus: yup.string().oneOf(["Single", "Married", "Divorced"]).required(),
  accountSubType: yup.string().oneOf(["Savings", "Checking"]).required(),
  pin: yup.string().required("Four digits required").required(),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match"),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate(); // For navigation

  const {
    register,
    handleSubmit,
    setValue,
    formState: {  },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setProfileImage(data.secure_url);
    setValue("profilePicture", data.secure_url);
  };

  const formatSSN = (value: string) => {
    // Remove non-digits
    let ssn = value.replace(/\D/g, "");
    if (ssn.length > 9) ssn = ssn.slice(0, 9);

    // Format SSN: XXX-XX-XXXX
    if (ssn.length >= 3 && ssn.length <= 5) {
      ssn = `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    } else if (ssn.length > 5) {
      ssn = `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
    }

    setValue("ssn", ssn);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    await addUser(data);
    alert("User Registered Successfully!");
    setLoading(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-50 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-6 text-purple-700">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
  {/* Name Fields */}
  <div>
    <label htmlFor="" className="font-semibold">First Name</label>
    <input {...register("firstName")} placeholder="" className="input w-full  border py-3 border-[#ccc]" />
  </div>
  <div>
  <label htmlFor="" className="font-semibold">Middle Name</label>
    <input {...register("middleName")} placeholder="" className="input w-full border py-3 border-[#ccc]" />
  </div>
  <div>
  <label htmlFor="" className="font-semibold">Last Name</label>
    <input {...register("lastName")} placeholder="" className="input w-full border py-3 border-[#ccc]" />
  </div>

  {/* Email & SSN */}
  <div>
  <label htmlFor="" className="font-semibold">Email</label>
    <input {...register("email")} placeholder="" className="input w-full border py-3 border-[#ccc]" />
  </div>
  <div>
  <label htmlFor="" className="font-semibold">SSN *</label>
    <input
      {...register("ssn")}
      placeholder=""
      className="input w-full border py-3 border-[#ccc]"
      onChange={(e) => formatSSN(e.target.value)}
    />
  </div>

  {/* Address */}

  <div>
  <label htmlFor="" className="font-semibold">Address</label>
  
    <input {...register("address")} placeholder="" className="input w-full   border py-3 border-[#ccc]" />
    <div className="flex gap-3 mt-2"><input type="checkbox" name="" id="" /> <p>Billing address same as Address</p>
      </div> 
  </div>

  {/* Gender, DOB, Marital Status */}
  <div>
  <label htmlFor="" className="font-semibold">Gender</label>
    <select {...register("gender")} className="input w-full   border py-3 border-[#ccc]">
      {/* <option value=""> </option> */}
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>
  <div>
  <label htmlFor="" className="font-semibold">Date of Birth</label>
    <input {...register("dob")} type="date" className="input w-full   border py-3 border-[#ccc]" />
  </div>
  <div>
  <label htmlFor="" className="font-semibold">Marital Status</label>
    <select {...register("maritalStatus")} className="input w-full   border py-3 border-[#ccc]">
      {/* <option value="">Select </option> */}
      <option value="Single">Single</option>
      <option value="Married">Married</option>
      <option value="Divorced">Divorced</option>
    </select>
  </div>

  {/* Account Type */}
  <div>
  <label htmlFor="" className="font-semibold">Account Type</label>
    <select {...register("accountType")} className="input w-full   border py-3 border-[#ccc]">
      {/* <option value=""></option> */}
      <option value="Personal">Personal</option>
      <option value="Business">Business</option>
    </select>
  </div>
  <div>
  <label htmlFor="" className="font-semibold">Account Sub Type</label>
    <select {...register("accountSubType")} className="input w-full   border py-3 border-[#ccc]">
      {/* <option value=""></option> */}
      <option value="Savings">Savings</option>
      <option value="Checking">Checking</option>
    </select>
  </div>

  {/* Profile Picture Upload */}
  <div className="flex flex-col items-center">
   <label htmlFor="" className="font-semibold flex justify-start">Upload Profile Picture</label>
   {profileImage && <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full mb-2" />}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
      className="border p-2 rounded w-full"
    />
  </div>

  {/* Password Fields */}
  <div>
  <label htmlFor="" className="font-semibold">4 digits Pin</label>
  <input
    {...register("pin")}
    type="tel"
    pattern="\d{4}"
    placeholder="Enter 4 digits"
    maxLength={4}
    inputMode="numeric"
    className="input w-full border py-3 border-[#ccc]"
  />
</div>


  <div>
  <label htmlFor="" className="font-semibold">Password *</label>
    <input {...register("password")} type="password" placeholder="" className="input w-full   border py-3 border-[#ccc]" />
  </div>
  <div>
  <label htmlFor="" className="font-semibold">Confirm Password *</label>
    <input {...register("confirmPassword")} type="password" placeholder="" className="input w-full   border py-3 border-[#ccc]" />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md"
    disabled={loading}
  >
    {loading ? "Submitting..." : "Register"}
  </button>
<Link to='/login'> <button className="w-full  mt-4 mb-6 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md"> Login</button>

</Link>
 </form>

    </div>
  );
};

export default SignUp;
