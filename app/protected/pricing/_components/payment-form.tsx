"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";

const PaymentForm = () => {
  const router = useRouter();
  const onSubmit = async () => {
    try {
      const response = await axios.post("/api/checkout-session", {
        amount: 100,
        packageName: "Default Package",
        packageCode: "Default Package",
        quantity: 1,
        transactionId: "",
      });
      console.log(response);
      router.push(response.data.url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button onClick={onSubmit}>Pay</Button>
    </div>
  );
};

export default PaymentForm;
