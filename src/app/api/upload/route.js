import nextConnect from "next-connect";
import multer from "multer";
import xlsx from "xlsx";
import prisma from "../../../lib/prisma";

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  try {
    if (!req.file) {
      console.log("No file uploaded rayen");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Insert data into the database
    for (const clientData of data) {
      await prisma.client.create({
        data: {
          /*
          name: clientData["nom et prenom"],
          num: clientData["numero telephone"],
          gredit: parseFloat(clientData["montant crédit calculer"]),
          designation: clientData["commentaires"],
          date: new Date(),
          */
          name: clientData["name"],
          num: clientData["num"],
          gredit: parseFloat(clientData["gredit"]),
          designation: clientData["designation"],
          date: new Date(),
        },
      });
    }

    res
      .status(200)
      .json({ message: "File uploaded and data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
