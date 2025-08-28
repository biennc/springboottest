package com.example.springboottest.controller;

import com.example.springboottest.dtos.EmployeeCreateDTO;
import com.example.springboottest.dtos.EmployeeDTO;
import com.example.springboottest.dtos.EmployeeUpdateDTO;
import com.example.springboottest.exception.EntityDuplicateException;
import com.example.springboottest.exception.EntityNotFoundException;
import com.example.springboottest.services.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(
    origins = {
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://your-frontend-domain.com"
    },
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class EmployeeController {
    @Autowired
    private EmployeeService service;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody EmployeeCreateDTO dto) {
        try {
            EmployeeDTO created = service.create(dto);
            return buildResponse(true, created, "Employee created successfully", HttpStatus.CREATED);
        } catch (EntityDuplicateException e) {
            throw new EntityDuplicateException(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> findAll() {
        List<EmployeeDTO> employees = service.findAll();
        return buildResponse(true, employees, "Success", HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable Long id) {
        try {
            EmployeeDTO employee = service.findById(id);
            return buildResponse(true, employee, "Success", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            throw new EntityNotFoundException("Employee not found with id: " + id);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @Valid @RequestBody EmployeeUpdateDTO dto) {
        try {
            EmployeeDTO updated = service.update(id, dto);
            return buildResponse(true, updated, "Employee updated successfully", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            throw new EntityNotFoundException("Employee not found with id: " + id);
        } catch (EntityDuplicateException e) {
            throw new EntityDuplicateException(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return buildResponse(true, null, "Employee deleted successfully", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            throw new EntityNotFoundException("Employee not found with id: " + id);
        }
    }

    private ResponseEntity<Map<String, Object>> buildResponse(boolean success, Object data, String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("data", data);
        response.put("message", message);
        return new ResponseEntity<>(response, status);
    }
}