"use client";

import React, { useEffect } from "react";

const AdBanner = ({ dataAdSlot, dataAdFormat, dataFullWidthResponsive }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <div className="w-[15%] m-5">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7147387469181788"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
};

export default AdBanner;
