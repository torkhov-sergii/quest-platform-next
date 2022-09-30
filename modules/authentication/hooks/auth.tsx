import useSWR from 'swr';
// import axios from '@/lib/axios'
import axios, { csrf } from '@modules/authentication/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

declare type AuthMiddleware = 'auth' | 'guest';

interface IUseAuth {
  middleware: AuthMiddleware;
  redirectIfAuthenticated?: string;
}

//https://github.com/roketid/windmill-nextjs-laravel-breeze
export const useAuth = (config: IUseAuth) => {
  const router = useRouter();
  const { middleware, redirectIfAuthenticated } = config;

  const setAuthorization = (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'Authorization',
        JSON.stringify({
          isLoggedIn: true,
          user: user,
        })
      );
    }
  };

  const getAuthorization = () => {
    if (typeof window !== 'undefined') {
      let auth = localStorage.getItem('Authorization');

      if (auth) {
        return JSON.parse(auth);
      } else {
        return {
          isLoggedIn: false,
          user: {},
        };
      }
    }
  };

  const { data: auth, error, mutate } = useSWR('/api/user', () => getAuthorization());

  const getUser = () => {
    axios
      .get('/api/user')
      .then((res) => {
        let user = res.data;

        setAuthorization(user);
        return user;
      })
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push('/verify-email');
      });
  };

  // const register = async ({ setErrors, ...props }) => {
  //     await csrf()
  //
  //     setErrors([])
  //
  //     axios
  //         .post('/register', props)
  //         .then(() => mutate())
  //         .catch(error => {
  //             if (error.response.status !== 422) throw error
  //
  //             setErrors(error.response.data.errors)
  //         })
  // }

  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post('/login', props)
      .then(() => {
        getUser();
      })
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  // const forgotPassword = async ({ setErrors, setStatus, email }) => {
  //     await csrf()
  //
  //     setErrors([])
  //     setStatus(null)
  //
  //     axios
  //         .post('/forgot-password', { email })
  //         .then(response => setStatus(response.data.status))
  //         .catch(error => {
  //             if (error.response.status !== 422) throw error
  //
  //             setErrors(error.response.data.errors)
  //         })
  // }

  // const resetPassword = async ({ setErrors, setStatus, ...props }) => {
  //     await csrf()
  //
  //     setErrors([])
  //     setStatus(null)
  //
  //     axios
  //         .post('/reset-password', { token: router.query.token, ...props })
  //         .then(response => router.push('/login?reset=' + btoa(response.data.status)))
  //         .catch(error => {
  //             if (error.response.status !== 422) throw error
  //
  //             setErrors(error.response.data.errors)
  //         })
  // }

  // const resendEmailVerification = ({ setStatus }) => {
  //     axios
  //         .post('/email/verification-notification')
  //         .then(response => setStatus(response.data.status))
  // }

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'Authorization',
        JSON.stringify({
          isLoggedIn: false,
          user: {},
        })
      );
    }

    if (!error) {
      await axios.post('/logout').then(() => mutate());
    }

    window.location.pathname = '/login';
  };

  useEffect(() => {
    // console.log('auth middleware');
    if (middleware === 'guest' && redirectIfAuthenticated && auth?.isLoggedIn) router.push(redirectIfAuthenticated);
    //if (window.location.pathname === "/verify-email" && user?.email_verified_at) router.push(redirectIfAuthenticated)
    if (middleware === 'auth' && error) logout();
    // }, [user, error])
  }, [middleware, redirectIfAuthenticated, router, auth, error]);

  return {
    auth,
    // register,
    login,
    // forgotPassword,
    // resetPassword,
    // resendEmailVerification,
    logout,
  };
};
