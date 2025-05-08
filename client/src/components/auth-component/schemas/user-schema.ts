import {z} from 'zod';

export const signInSchema = z.object({
  email: z.string().email({message: 'Please enter a valid email address'}),
  password: z.string().min(6).max(20),
});

export const signUpSchema = z.object({
  username: z.string().min(1),
  email: z.string().email({message: 'Please enter a valid email address'}),
  password: z.string().min(6).max(20),
});

export type UserSignInType = z.infer<typeof signInSchema>;

export type UserSignUpType = z.infer<typeof signUpSchema>;
