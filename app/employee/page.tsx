'use client';

import React from 'react';
import ImmersivePayrollDashboard from '@/src/components/ImmersivePayrollDashboard';

export default function EmployeePortal() {
  return (
    <div className="w-full min-h-screen bg-[#01030a] text-white animate-in fade-in duration-500">
      <ImmersivePayrollDashboard />
    </div>
  );
}
