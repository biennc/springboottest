'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gender, Employee } from '../../libs/types';
import { 
  employeeCreateSchema, 
  employeeUpdateSchema, 
  EmployeeCreateFormData, 
  EmployeeUpdateFormData 
} from '../../libs/validation';
import { useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees';

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const isEditing = !!employee;
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const form = useForm<EmployeeCreateFormData | EmployeeUpdateFormData>({
    resolver: zodResolver(isEditing ? employeeUpdateSchema : employeeCreateSchema),
    defaultValues: isEditing
      ? {
          fullName: employee.fullName,
          dateOfBirth: employee.dateOfBirth,
          gender: employee.gender,
          phoneNumber: employee.phoneNumber,
          active: employee.active,
          password: '',
        }
      : {
          fullName: '',
          email: '',
          dateOfBirth: '',
          gender: Gender.MALE,
          phoneNumber: '',
          active: true,
          password: '',
        },
  });

  const onSubmit = async (data: EmployeeCreateFormData | EmployeeUpdateFormData) => {
    try {
      if (isEditing) {
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateMutation.mutateAsync({ 
          id: employee.id, 
          data: updateData as any 
        });
      } else {
        await createMutation.mutateAsync(data as EmployeeCreateFormData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Edit Employee' : 'Create New Employee'}
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            {...form.register('fullName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter full name"
          />
          {form.formState.errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email (only for create) */}
        {!isEditing && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...form.register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
            {form.formState.errors['email' as keyof typeof form.formState.errors] && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors['email' as keyof typeof form.formState.errors]?.message}
              </p>
            )}
          </div>
        )}

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            id="dateOfBirth"
            type="date"
            {...form.register('dateOfBirth')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            id="gender"
            {...form.register('gender')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.OTHER}>Other</option>
          </select>
          {form.formState.errors.gender && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.gender.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            id="phoneNumber"
            type="tel"
            {...form.register('phoneNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter 10-digit phone number"
            maxLength={10}
          />
          {form.formState.errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...form.register('active')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Active Employee</span>
          </label>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password {isEditing ? '(leave blank to keep current)' : '*'}
          </label>
          <input
            id="password"
            type="password"
            {...form.register('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={isEditing ? 'Enter new password (optional)' : 'Enter password'}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Employee' : 'Create Employee')}
          </button>
        </div>
      </form>
    </div>
  );
}