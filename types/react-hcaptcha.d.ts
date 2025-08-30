declare module 'react-hcaptcha' {
  import * as React from 'react';

  interface HCaptchaProps {
    sitekey: string;
    onVerify: (token: string) => void;
    onExpire?: () => void;
  }

  const HCaptcha: React.FC<HCaptchaProps>;
  export default HCaptcha;
}
