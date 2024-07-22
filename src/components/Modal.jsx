import React from "react";
import { Button } from "@/components/ui/button";

export function Modal({ isOpen, onClose, id }) {
  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create FormData object from the form
    const formData = new FormData(event.target);
    const data = {
      type: formData.get("type"),
      montant: parseFloat(formData.get("amount")), // Ensure amount is a number
      designation: formData.get("designation"),
      date: formData.get("date") || new Date().toISOString(), // Use current date if not provided
      clientId: parseInt(id), // Assuming `id` is defined in your component and needs to be converted to an integer
    };

    try {
      console.log("data", data);
      // Send a POST request to the API endpoint
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the response is OK
      if (response.ok) {
        const result = await response.json();
        console.log("Transaction created:", result);
        onClose(); // Close the modal on successful transaction creation
      } else {
        const errorData = await response.json();
        console.error("Error creating transaction:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log("clientId", id);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Achat & Acompte</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Type</label>
            <select
              name="type"
              required
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="">Select Type</option>
              <option value="achat">Achat</option>
              <option value="acompte">Acompte</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Designation</label>
            <input
              type="text"
              name="designation"
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 text-white">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
