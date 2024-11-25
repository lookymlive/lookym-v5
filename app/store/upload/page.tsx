import { Metadata } from "next";
import StoreUploadForm from "@/components/store/StoreUploadForm";

export const metadata: Metadata = {
  title: "Upload Products | Lookym",
  description: "Upload your store products to Lookym",
};

export default function StoreUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Upload Products
        </h1>
        <StoreUploadForm />
      </div>
    </div>
  );
}
