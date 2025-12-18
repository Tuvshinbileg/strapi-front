import SupersetDashboard from '@/components/dashboard/SupersetDashboard';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Overview</h1>
      
      {/* Dashboard 1 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Борлуулалт</h2>
        <SupersetDashboard 
          dashboardId="sales-dashboard-uuid"
          height="600px"
        />
      </div>

      {/* Dashboard 2 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Хэрэглэгчид</h2>
        <SupersetDashboard 
          dashboardId="users-dashboard-uuid"
          height="600px"
        />
      </div>

      {/* Dashboard 3 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Санхүү</h2>
        <SupersetDashboard 
          dashboardId="finance-dashboard-uuid"
          height="600px"
        />
      </div>
    </div>
  );
}
