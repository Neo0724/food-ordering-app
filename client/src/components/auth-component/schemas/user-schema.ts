import {z} from 'zod';

export const signInSchema = z.object({
  email: z
    .string({required_error: 'Email is required'})
    .email({message: 'Please enter a valid email address'})
    .min(1, 'Email is required'),
  password: z
    .string({required_error: 'Password is required'})
    .min(6, 'Password must contains at least 6 characters')
    .max(20, 'The maximum length of the password is 20 characters')
    .min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  username: z
    .string({required_error: 'Username is required'})
    .min(1, {message: 'Username is required'})
    .max(30, 'The maximum length of the username is 30 characters'),
  email: z
    .string({required_error: 'Email is required'})
    .email({message: 'Please enter a valid email address'})
    .min(1, 'Email is required'),
  password: z
    .string({required_error: 'Password is required'})
    .min(6, 'Password must contains at least 6 characters')
    .max(20, 'The maximum length of the password is 20 characters'),
});

export const changePasswordSchema = signUpSchema.pick({password: true});

export const changeUsernameSchema = signUpSchema.pick({username: true});

export type UserSignInType = z.infer<typeof signInSchema>;

export type UserSignUpType = z.infer<typeof signUpSchema>;

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export type ChangeUsernameType = z.infer<typeof changeUsernameSchema>;
