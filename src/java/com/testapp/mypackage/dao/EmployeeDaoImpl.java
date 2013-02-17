/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.testapp.mypackage.dao;
import com.testapp.mypackage.model.Department;
import com.testapp.mypackage.model.Employee;
import com.testapp.mypackage.util.HibernateUtil;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Основной
 */
@Repository("employeeDaoImpl")
public class EmployeeDaoImpl implements EmployeeDao {

    @Override
    public void save(Employee employee) {
        Session hibSession = HibernateUtil.getSession();
        hibSession.beginTransaction();
        hibSession.save(employee);
        hibSession.beginTransaction().commit();
        hibSession.flush();
    }
    
    @Override
    public void update(Employee employee) {
        Session hibSession = HibernateUtil.getSession();
        hibSession.beginTransaction();
        hibSession.update(employee);
        hibSession.beginTransaction().commit();
        hibSession.flush();
    }
    
    @Override
    public void delete(Employee employee) {
        Session hibSession = HibernateUtil.getSession();
        hibSession.beginTransaction();
        hibSession.delete(employee);
        hibSession.beginTransaction().commit();
        hibSession.flush();
    }
    
    @Override
    public List<Employee> getAll() {
        Session hibSession = HibernateUtil.getSession();
        hibSession.beginTransaction();
        List <Employee> employees = hibSession.createCriteria(Employee.class)
                .list();
        hibSession.beginTransaction().commit();
        hibSession.flush();
        return employees;
    }

    @Override
    public Employee getById(int empl_id) {
        Session hibSession = HibernateUtil.getSession();
        hibSession.beginTransaction();
        List <Employee> employees = hibSession.createCriteria(Employee.class)
                .add(Restrictions.eq("empl_id", empl_id))
                .list();
        return employees.get(0);
    }
    
    @Override
    public boolean verify(Employee employee) {
        return (employee.getName().matches("^[а-яА-Я]+$") && employee.getSurname().matches("^[а-яА-Я]+$") 
                && employee.getName().length() > 0 && employee.getSurname().length() > 0 
                && employee.getName().length() <= 50 && employee.getSurname().length() <= 50);
    }
}
