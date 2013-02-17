/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.testapp.mypackage.controller;

import com.testapp.mypackage.dao.EmployeeDaoImpl;
import com.testapp.mypackage.model.Employee;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Основной
 */
@Controller
public class EmployeeController {
    
    private EmployeeDaoImpl employeeDaoImpl = new EmployeeDaoImpl();
    
    @RequestMapping(value="submitemployee", method=RequestMethod.POST)
    public @ResponseBody String submitEmployee(@RequestBody String emplJson) {
        Employee employee = new Employee();
        
        System.out.println(emplJson + "ФФФФФФФФФФФФФФФФФФФФФФФФФФФФФФФФФФ");
        String utf8String = "";
        String text = "";
        try {
        text = new String(emplJson.getBytes("UTF-8"));
        utf8String = new String(emplJson.getBytes("Cp1251"), "UTF-8");
        } catch (UnsupportedEncodingException ex) {}
        System.out.println(utf8String);
        System.out.println(text);
        
        try {
        ObjectMapper mapper = new ObjectMapper();
        employee = mapper.readValue(emplJson, Employee.class);
        } catch (JsonGenerationException e) {
		e.printStackTrace();
	} catch (JsonMappingException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	}
        if (!employeeDaoImpl.verify(employee)) return "failure";
        employeeDaoImpl.save(employee);
        return "success";
    }
    
    @RequestMapping(value="getemployees", method=RequestMethod.GET, produces="text/plain;charset=UTF-8")
    public @ResponseBody String getEmployees() {
        List <Employee> employees = employeeDaoImpl.getAll();
        String answer = "failure";
        try {
        ObjectMapper mapper = new ObjectMapper();
        answer = mapper.writeValueAsString(employees);
        } catch (JsonGenerationException e) {
		e.printStackTrace();
	} catch (JsonMappingException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	}
        return answer;
    }
    
    @RequestMapping(value="deleteemployee", method=RequestMethod.POST)
    public @ResponseBody String deleteEmployee(@RequestBody String emplJson) {
        System.out.println(emplJson);
        Employee employee = new Employee();
        try {
        ObjectMapper mapper = new ObjectMapper();
        employee = mapper.readValue(emplJson, Employee.class);
        } catch (JsonGenerationException e) {
		e.printStackTrace();
	} catch (JsonMappingException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	}
        if (!employeeDaoImpl.verify(employee)) return "failure";
        employeeDaoImpl.delete(employee);
        return "success";
    }
    
    @RequestMapping(value="updateemployee", method=RequestMethod.POST)
    public @ResponseBody String updateEmployee(@RequestBody String emplJson) {
        Employee employee = new Employee();
        try {
        ObjectMapper mapper = new ObjectMapper();
        employee = mapper.readValue(emplJson, Employee.class);
        } catch (JsonGenerationException e) {
		e.printStackTrace();
	} catch (JsonMappingException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	}
        if (!employeeDaoImpl.verify(employee)) return "failure";
        employeeDaoImpl.update(employee);
        return "success";
    }
    
}
