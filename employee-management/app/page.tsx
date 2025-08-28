'use client';

import { useState } from 'react';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { Employee } from '../libs/types';

type ViewMode = 'list' | 'create' | 'edit';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
    setViewMode('create');
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewMode('edit');
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setSelectedEmployee(undefined);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedEmployee(undefined);
  };

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <EmployeeList
          onAdd={handleAddEmployee}
          onEdit={handleEditEmployee}
        />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <EmployeeForm
          employee={selectedEmployee}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}