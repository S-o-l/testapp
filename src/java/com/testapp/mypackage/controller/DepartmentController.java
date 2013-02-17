/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.testapp.mypackage.controller;

import com.testapp.mypackage.dao.DepartmentDaoImpl;
import com.testapp.mypackage.model.Department;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Основной
 */
@Controller
public class DepartmentController {
    
    private DepartmentDaoImpl departmentDaoImpl = new DepartmentDaoImpl();
    
    @RequestMapping(value="getDepartments", method=RequestMethod.GET)
    public @ResponseBody List<Department> getDepartments() {
        List <Department> departments = departmentDaoImpl.getAll();
        return departments;
    }
    
}
