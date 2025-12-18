import SupersetDashboard from '@/components/dashboard/SupersetDashboard';

export default function DashboardPage() {
  // Dashboard ID-г Superset URL-аас авна
  // Жишээ: https://your-superset.com/superset/dashboard/abc-123/
  const dashboardId = '494c8086-5355-4914-9d7f-3496f34c3254';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Борлуулалтын Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <SupersetDashboard 
          dashboardId={dashboardId}
					width="500px"
          height="800px"
          hideTitle={false}
          hideChartControls={false}
          hideTab={false}
        />
      </div>
    </div>
  );
}