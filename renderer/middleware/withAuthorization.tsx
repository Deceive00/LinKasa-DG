// middleware/withAuthorization.ts
import { FC } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/firebase-config';
import { useUser } from '../lib/userContext';

interface WithAuthorizationProps {
  allowedRoles: string[];
}

const withAuthorization = (allowedRoles: string[]) => (
  WrappedComponent: FC<WithAuthorizationProps>
): FC<WithAuthorizationProps> => {
  const WithAuthorization: FC<WithAuthorizationProps> = (props) => {
    const router = useRouter();
    // const user = auth.currentUser;
    const {user} = useUser();

    if (!user) {
      router.push('/auth/login');
      return null;
    }

    const userRole = user?.role; 

    if (!allowedRoles.includes(userRole)) {

      router.push('/unauthorized'); 
      return (<div>You do not have permission to access this page.</div>);
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthorization;
};

export default withAuthorization;
