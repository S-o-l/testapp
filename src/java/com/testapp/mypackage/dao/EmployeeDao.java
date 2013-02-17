/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.testapp.mypackage.dao;
import com.testapp.mypackage.model.Employee;
import java.util.List;

/**
 *
 * @author Основной
 */
public interface EmployeeDao {
 
    void save(Employee employee);
    void update(Employee employee);
    void delete(Employee employee);
    List<Employee> getAll();
    Employee getById(int empl_id);
    boolean verify(Employee employee);
        
}
