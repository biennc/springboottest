import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from './../libs/api';
import { Employee, EmployeeCreateDTO, EmployeeUpdateDTO } from './../libs/types';
import toast from 'react-hot-toast';

// Query keys
export const employeeKeys = {
  all: ['employees'] as const,
  detail: (id: number) => ['employees', id] as const,
};

// Get all employees
export const useEmployees = () => {
  return useQuery({
    queryKey: employeeKeys.all,
    queryFn: employeeApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get employee by ID
export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create employee mutation
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeCreateDTO) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast.success('Employee created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create employee';
      toast.error(message);
    },
  });
};

// Update employee mutation
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateDTO }) =>
      employeeApi.update(id, data),
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee.id),
        updatedEmployee
      );
      toast.success('Employee updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update employee';
      toast.error(message);
    },
  });
};

// Delete employee mutation
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.removeQueries({ queryKey: employeeKeys.detail(deletedId) });
      toast.success('Employee deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete employee';
      toast.error(message);
    },
  });
};