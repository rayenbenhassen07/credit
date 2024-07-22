"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/Modal"; // Import the modal component
import { ModalTransactions } from "@/components/ModalTransactions"; // Import the new modal component

export default function ClientPage({ params }) {
  const { clientId } = params;
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isModalTransactionsOpen, setIsModalTransactionsOpen] = useState(false); // State for transactions modal
  const router = useRouter();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setClient(data);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to fetch client");
        }
      } catch (error) {
        setError("Failed to fetch client");
        console.error("Failed to fetch client", error);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleBack = () => {
    router.push("/");
  };

  const handleAchat = () => {
    setIsModalOpen(true); // Open modal
  };

  const handleHistorique = () => {
    setIsModalTransactionsOpen(true); // Open transactions modal
  };

  const handleModalSubmit = async (data) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/achat-acompte`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Success:", result);
        setIsModalOpen(false); // Close modal
      } else {
        const result = await res.json();
        setError(result.error || "Failed to submit data");
      }
    } catch (error) {
      setError("Failed to submit data");
      console.error("Failed to submit data", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button onClick={handleBack} className="mb-4 bg-blue-500 text-white">
        Back
      </Button>
      <Card className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">{client.name}</h1>
        <p className="text-gray-600">Phone Number: {client.num}</p>
        <p className="text-gray-600">Credit: {client.gredit} TND</p>
        <p className="text-gray-600">Designation: {client.designation}</p>
        <p className="text-gray-600">
          Date Added: {new Date(client.date).toLocaleDateString()}
        </p>
        <div className="mt-4 flex space-x-4">
          <Button onClick={handleAchat} className="bg-green-500 text-white">
            Achat & Acompte
          </Button>
          <Button
            onClick={handleHistorique}
            className="bg-purple-500 text-white"
          >
            Historique
          </Button>
        </div>
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        id={clientId}
      />
      <ModalTransactions
        isOpen={isModalTransactionsOpen}
        onClose={() => setIsModalTransactionsOpen(false)}
        id={clientId}
      />
    </div>
  );
}
