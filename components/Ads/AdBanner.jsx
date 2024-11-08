"use client";

import Head from "next/head";
import React, { useEffect } from "react";

const AdBanner = ({ dataAdSlot, dataAdFormat, dataFullWidthResponsive }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <>
    <Head>
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7147387469181788`} crossOrigin="anonymous"></script>
    </Head>
    <div className="w-[15%] m-5">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7147387469181788"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
        ></ins>
    </div>
        </>
  );
};

export default AdBanner;
