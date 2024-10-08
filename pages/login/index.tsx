import { MSCard, MSSpinner } from '@/components';
import { LoginForm, useLogin } from '@/components/auth';
import { MSLogo } from '@/utils/icons';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Login = () => {
  const router = useRouter();

  const {
    handleLogin,
    loginMutationStatus: { isLoading, data },
  } = useLogin();
  const onSubmit = async (values: any) => {
    const { password, username } = values;
    handleLogin({
      identifier: username.trim(),
      password,
    });
  };

  useEffect(() => {
    if (data) {
      router.push('/');
    }
  }, [data]);
  return (
    <div className="login-wrapper h-screen flex items-center justify-center">
      <MSCard className="w-4/5 sm:w-4/5 md:max-w-xl">
        <MSSpinner loading={isLoading}>
          <div className="form-content-wrapper  mx-auto">
            <div className="logo mx-auto w-full flex justify-center">
              <MSLogo />
            </div>
            <div className="login-form-wrapper pt-8">
              <LoginForm onSubmit={onSubmit} />
            </div>
          </div>
        </MSSpinner>
      </MSCard>
    </div>
  );
};
Login.getLayout = (page: any) => page;
export default Login;
