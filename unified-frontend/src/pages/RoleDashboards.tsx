export const SellerDashboard = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-blue-700 pb-4 border-b border-gray-200">
      Seller Dashboard | विक्रेता पोर्टल
    </h1>
    <p className="text-gray-700">Manage your raw material products and farmer inquiries.</p>
  </div>
);

export const AdminDashboard = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-purple-700 pb-4 border-b border-gray-200">
      Admin Dashboard | प्रशासक पोर्टल
    </h1>
    <p className="text-gray-700">Manage users, schemes, and verify sellers.</p>
  </div>
);

export const PendingVerification = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-orange-700 pb-4 border-b border-gray-200">
      Verification Pending
    </h1>
    <p className="text-gray-700">Your seller account is under review. Please wait for admin approval.</p>
  </div>
);
