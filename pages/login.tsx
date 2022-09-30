// import GuestLayout from '@/components/Layouts/GuestLayout';
// import InputError from '@/components/InputError';
// import Label from '@/components/Label';
import Link from 'next/link';
// import { useAuth } from '@/hooks/auth';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import AuthCard from '../modules/authentication/components/auth-card/AuthCard';
import AuthSessionStatus from '../modules/authentication/components/auth-session-status/AuthSessionStatus';
import { Button, TextField } from "@mui/material";
import Layout from '@modules/shared/components/layouts/layout';
import { Location } from "@modules/location/types/location";
import { useAuth } from "@modules/authentication/hooks/auth";
import { initializeApollo } from "@services/graphql/conf/apollo";
import { GetPage } from "@modules/page/graphql";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getLocationsService from "@modules/location/services/get-locations.service";

type Props = {
    serverProps: any;
};

// const Login = () => {
const Login: React.FC<Props> = ({ serverProps }) => {
  const router = useRouter();

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/',
  });

  const [submitting, setSubmittingState] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldRemember, setShouldRemember] = useState(true);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  // useEffect(() => {
  //   if (router.query.reset?.length > 0 && errors.length === 0) {
  //     setStatus(atob(router.query.reset));
  //   } else {
  //     setStatus(null);
  //   }
  // });

  const submitForm = async (event) => {
    event.preventDefault();

    setSubmittingState(true)
    login({ email, password, remember: shouldRemember, setErrors, setStatus });
    setSubmittingState(false)
  };

  return (
    <Layout serverProps={serverProps}>
        {/* Session Status */}
        <AuthSessionStatus className="mb-4" status={status} />

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div>
            {/*<Label htmlFor="email">Email</Label>*/}

            <TextField name={"email"} type="email" required={true} label="email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} />

            {/*<InputError messages={errors.email} className="mt-2" />*/}
          </div>

          {/* Password */}
          <div className="mt-4">
            {/*<Label htmlFor="password">Password</Label>*/}

            {/*<Input id="password" type="password" value={password} className="block mt-1 w-full" onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />*/}
            <TextField name={"password"} required={true} label="password" variant="outlined" value={password} onChange={(event) => setPassword(event.target.value)} />

            {/*<InputError messages={errors.password} className="mt-2" />*/}
          </div>

          {/* Remember Me */}
          <div className="block mt-4">
            {/*<label htmlFor="remember_me" className="inline-flex items-center">*/}
            {/*  <input*/}
            {/*    id="remember_me"*/}
            {/*    type="checkbox"*/}
            {/*    name="remember"*/}
            {/*    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"*/}
            {/*    onChange={(event) => setShouldRemember(event.target.checked)}*/}
            {/*  />*/}

            {/*  <span className="ml-2 text-sm text-gray-600">Remember me</span>*/}
            {/*</label>*/}
          </div>

          <div className="flex items-center justify-end mt-4">
            {/*<Link href="/forgot-password">*/}
            {/*  <a className="underline text-sm text-gray-600 hover:text-gray-900">Forgot your password?</a>*/}
            {/*</Link>*/}

            <Button onClick={(event) => submitForm(event)} disabled={submitting}>Login</Button>
          </div>
        </form>
    </Layout>
  );
};

export default Login;

export async function getServerSideProps({ ctx, locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
    },
  };
}
