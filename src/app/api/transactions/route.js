import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { type, montant, designation, date, clientId } = await req.json();

    const data = {
      type,
      montant: parseFloat(montant), // Ensure the montant is stored as a float
      designation,
      clientId,
    };

    if (date) {
      data.date = new Date(date); // Ensure the date is in Date format
    }

    const newTransaction = await prisma.transaction.create({
      data,
    });

    // Update the client's gredit field based on the transaction type
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    let newGredit = client.gredit;
    if (type === "achat") {
      newGredit += montant;
    } else {
      newGredit -= montant;
    }

    await prisma.client.update({
      where: { id: clientId },
      data: { gredit: newGredit },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
