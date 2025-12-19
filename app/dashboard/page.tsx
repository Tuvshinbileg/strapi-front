import SupersetDashboard from '@/components/dashboard/SupersetDashboard';

export default function DashboardPage() {
  // Dashboard ID-г Superset URL-аас авна
  // Жишээ: https://your-superset.com/superset/dashboard/abc-123/
  const dashboardId = '494c8086-5355-4914-9d7f-3496f34c3254';

  return (
    <div className='w-full col-span-full'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-bold'>Борлуулалтын Dashboard</h1>

        <div className='rounded-lg shadow-lg p-4 w-full min-h-screen'>
          <SupersetDashboard
            dashboardId={dashboardId}
            hideTitle={false}
            hideChartControls={false}
            hideTab={false}
          />
        </div>
      </div>
    </div>
  );
}
