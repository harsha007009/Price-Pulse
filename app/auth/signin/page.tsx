import { Metadata } from 'next';
import { SigninForm } from '@/components/signin-form';

export const metadata: Metadata = {
  title: 'Sign In - Price Pulse',
  description: 'Sign in to your Price Pulse account',
};

export default function SigninPage() {
  return (
    <div className="container max-w-screen-sm mx-auto py-12 px-4">
      <SigninForm />
    </div>
  );
}