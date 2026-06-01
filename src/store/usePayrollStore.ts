import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'employer' | 'employee' | 'treasurer' | null;
export type PayrollState = 'idle' | 'uploaded' | 'approved' | 'claimed';

interface PayrollStore {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  
  payrollState: PayrollState;
  setPayrollState: (state: PayrollState) => void;
  
  employerSignature: string | null;
  setEmployerSignature: (sig: string | null) => void;
  
  treasurerSignature: string | null;
  setTreasurerSignature: (sig: string | null) => void;
  
  employeeClaimHash: string | null;
  setEmployeeClaimHash: (hash: string | null) => void;
  
  resetWorkflow: () => void;
}

export const usePayrollStore = create<PayrollStore>()(
  persist(
    (set) => ({
      activeRole: null,
      setActiveRole: (role) => set({ activeRole: role }),
      
      payrollState: 'idle',
      setPayrollState: (state) => set({ payrollState: state }),
      
      employerSignature: null,
      setEmployerSignature: (sig) => set({ employerSignature: sig }),
      
      treasurerSignature: null,
      setTreasurerSignature: (sig) => set({ treasurerSignature: sig }),
      
      employeeClaimHash: null,
      setEmployeeClaimHash: (hash) => set({ employeeClaimHash: hash }),
      
      resetWorkflow: () => set({
        payrollState: 'idle',
        employerSignature: null,
        treasurerSignature: null,
        employeeClaimHash: null,
      })
    }),
    {
      name: 'stealthpay-global-store', // Saves securely using a proper state shape
    }
  )
);
