"use client";

import { useEffect } from "react";

const Phone = () => {
  useEffect(() => {
    // Automatically trigger the call when the component is mounted
    document.getElementById("call-link").click();
  }, []);

  return (
    <div>
      {/* Hidden link that will be auto-clicked */}
      <a id="call-link" href="tel:+886227530311" style={{ display: "none" }}>
        Call +1234567890
      </a>
      <p>
        If the call doesn't start automatically, please click{" "}
        <a href="tel:+1234567890">here</a>.
      </p>
    </div>
  );
};

export default Phone;
