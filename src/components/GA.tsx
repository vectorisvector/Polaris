/* cspell:disable */

import Script from "next/script";

export function GA() {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-G5SLVTDBC6"
      />
      <Script id="ga">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-G5SLVTDBC6');
        `}
      </Script>
    </>
  );
}
