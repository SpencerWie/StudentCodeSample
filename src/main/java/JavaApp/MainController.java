package JavaApp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController 
{

	@Autowired 
	private StudentRepository service;
	
	// Returns the main index.html page
    @RequestMapping(value = "/")
    public String index() 
    {
        return "index";
    }
    
    // Returns a list of all students
    @RequestMapping(value = "/api/students", method = RequestMethod.GET)
    public ResponseEntity<List<Student>> getStudents() 
    {
    	List<Student> students = (List<Student>) service.findAll();
        return new ResponseEntity<List<Student>>(students, HttpStatus.OK);
    }    
    
    // Returns a specific student
    @RequestMapping(value = "/api/students/{id}", method = RequestMethod.GET)
    public ResponseEntity<Student> getStudent(@PathVariable Long id )
    {
    	Student student = service.findOne(id);
    	return new ResponseEntity<Student>(student, HttpStatus.OK);
    }        
	
    // Creates a new student
    @RequestMapping(value = "/api/students", method = RequestMethod.POST)
    public ResponseEntity<Student> createStudent(@RequestBody Student student) 
    {
    	service.save(student);
    	return new ResponseEntity<Student>(student, HttpStatus.CREATED);
    }
    
    // Updates a student
    @RequestMapping(value = "/api/students/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Student> updateStudent(@RequestBody Student student, @PathVariable Long id )
    {
    	service.save(student);
    	return new ResponseEntity<Student>(student, HttpStatus.OK);
    }

    // Deletes a student
    @RequestMapping(value = "/api/students/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Long> deleteStudent(@PathVariable Long id)
    {
    	service.delete(id);
    	return new ResponseEntity<Long>(HttpStatus.OK);
    }
    
}
