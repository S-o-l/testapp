/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.testapp.mypackage.dao;

import com.testapp.mypackage.model.Department;
import com.testapp.mypackage.util.HibernateUtil;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Основной
 */
@Repository("departmentDaoImpl")
public class DepartmentDaoImpl implements DepartmentDao {
    
    @Override
    public List<Department> getAll() {
        Session hibSession = HibernateUtil.getSession();
        hibSession.beginTransaction();
        List <Department> departments = hibSession.createCriteria(Department.class)
                .list();
        hibSession.beginTransaction().commit();
        hibSession.flush();
        return departments;
    }
    
    @Override
    public Department getByTitle(String title) {
        Session hibSession = HibernateUtil.getSession();
        hibSession.beginTransaction();
        List <Department> departments = hibSession.createCriteria(Department.class)
                .add(Restrictions.eq("title", title))
                .list();
        hibSession.beginTransaction().commit();
        hibSession.flush();
        return departments.get(0);
    }
}
