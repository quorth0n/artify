import React from 'react';
import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp,
} from '@aws-amplify/ui-react';

const SignIn = () => (
  <AmplifyAuthenticator usernameAlias="username">
    <AmplifySignIn slot="sign-in">
      <div slot="secondary-footer-content">Signup is currently invite-only</div>
    </AmplifySignIn>
    <AmplifySignUp
      formFields={[
        {
          type: 'username',
          required: true,
        },
        {
          type: 'email',
          required: true,
        },
        {
          type: 'password',
          required: true,
        },
      ]}
      slot="sign-up"
    />
  </AmplifyAuthenticator>
);
export default SignIn;