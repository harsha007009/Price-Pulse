import { Metadata } from 'next';
import { SignupForm } from '@/components/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up - Price Pulse',
  description: 'Create a new account to track prices and get the best deals',
};

export default function SignupPage() {
  return (
    <div className="container max-w-screen-sm mx-auto py-12 px-4">
      <SignupForm />
    </div>
  );
}