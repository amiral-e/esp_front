"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0";

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Merci !</h1>
        <h2 className="text-2xl">Vous avez envoyé </h2>
        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
    </main>
  );
}

function Loading() {
  return <p className="text-center text-white">Chargement...</p>;
}
