/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.testapp.mypackage.dao;

import com.testapp.mypackage.model.Department;
import java.util.List;

/**
 *
 * @author Основной
 */
public interface DepartmentDao {

    List<Department> getAll();
    Department getByTitle(String title);

}
