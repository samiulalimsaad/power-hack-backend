import * as Yup from "yup";

export const LoginValidationSchema = Yup.object({
    name: Yup.string().required("Name is required").trim(),
    password: Yup.string().required("Password is required").min(8),
});

export const SignUpValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone Number is required"),
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must contain at least 8 characters")
        .required("Enter your password required"),
});

export const BillValidationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    phone: Yup.string().required("Phone Number is required"),
    paidAmount: Yup.string().required("Paid Amount is required"),
});
