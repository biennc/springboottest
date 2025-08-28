package com.example.springboottest.services;

import com.example.springboottest.dtos.EmployeeCreateDTO;
import com.example.springboottest.dtos.EmployeeDTO;
import com.example.springboottest.dtos.EmployeeUpdateDTO;
import com.example.springboottest.entities.Employee;
import com.example.springboottest.repos.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;  // Config ở bước sau

    public EmployeeDTO create(EmployeeCreateDTO dto) {
        Employee employee = Employee.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .phoneNumber(dto.getPhoneNumber())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .hashedPassword(passwordEncoder.encode(dto.getPassword()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        repository.save(employee);
        return toDTO(employee);
    }

    public List<EmployeeDTO> findAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public EmployeeDTO findById(Long id) {
        return repository.findById(id).map(this::toDTO).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public EmployeeDTO update(Long id, EmployeeUpdateDTO dto) {  // Ngoại trừ email
        Employee employee = repository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setFullName(dto.getFullName());
        // Không update email
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setGender(dto.getGender());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setActive(dto.getActive());
        if (dto.getPassword() != null) {
            employee.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        }
        employee.setUpdatedAt(LocalDateTime.now());
        repository.save(employee);
        return toDTO(employee);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private EmployeeDTO toDTO(Employee employee) {
        return EmployeeDTO.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .dateOfBirth(employee.getDateOfBirth())
                .gender(employee.getGender())
                .phoneNumber(employee.getPhoneNumber())
                .active(employee.getActive())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}