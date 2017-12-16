package JavaApp;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import com.google.gson.Gson;
import static org.assertj.core.api.Assertions.assertThat;
/*
 *  Important: Tests depend on the default single student "John Smith" defined in DatabaseLoader.
 * */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class UnitTest 
{
	@Autowired
	private MainController controller;
	
    @Autowired
    private TestRestTemplate rest;	 
	
	@LocalServerPort
	private int port;
	
	// Text to make sure the page loads correctly.
	@Test
	public void mainPageLoads() throws Exception 
	{
		String url = "http://localhost:" + port + "/";
		String content = this.rest.getForObject(url, String.class);
		
		// Page loads (not empty)
		assertThat(content).isNotEmpty();
		
		// Page contains the main <div> react places HTML in.
		assertThat(content).contains("<div id=\"main\">");
	}
	
	// Test students can be read, checks for initial default student.
	@Test
	public void ReadStudentTest() throws Exception
	{
		Gson g = new Gson();
		
		// Check that api/students {GET} returns a list of a single default student
		String url = "http://localhost:" + port + "/api/students";
		ResponseEntity<String> response = this.rest.getForEntity(url, String.class);
		
		Student[] students = g.fromJson(response.getBody(), Student[].class);
		
		assertThat(students.length).isEqualTo(1);
		if(students.length > 0)
		{
			Student student = students[0];
			assertThat(student.getId()).isEqualTo(1);
			assertThat(student.getAge()).isEqualTo(30);
			assertThat(student.getGrade()).isEqualTo("B");
			assertThat(student.getName()).isEqualTo("John Smith");
		}
		
		// Check that api/students/1 {GET} returns default student
		url = "http://localhost:" + port + "/api/students/1";
		response = this.rest.getForEntity(url, String.class);
		Student student = g.fromJson(response.getBody(), Student.class);
		assertThat(student.getName()).isEqualTo("John Smith");
	}
	
	// Test to edit initial student to new values.
	@Test 
	public void EditStudentTest() throws Exception
	{
		Gson g = new Gson();
		
		// Call Server to Update Student with ID of 1 to new values.
		String url = "http://localhost:" + port + "/api/students/1";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		String requestJSON = "{\"id\":1,\"name\":\"New Name\",\"grade\":\"C\",\"age\":50}";
		HttpEntity<String> entity = new HttpEntity<String>(requestJSON, headers);
		rest.put(url, entity);
		
		// Read Back Student 1, check to ensure values where updated.
		ResponseEntity<String> response = this.rest.getForEntity(url, String.class);
		Student student = g.fromJson(response.getBody(), Student.class);
		assertThat(student.getId()).isEqualTo(1);
		assertThat(student.getAge()).isEqualTo(50);
		assertThat(student.getGrade()).isEqualTo("C");
		assertThat(student.getName()).isEqualTo("New Name");
		
		// Now Change the student back to it's initial values and re-check
		requestJSON = "{\"id\":1,\"name\":\"John Smith\",\"grade\":\"B\",\"age\":30}";
		entity = new HttpEntity<String>(requestJSON, headers);
		rest.put(url, entity);		
		
		// Read Back Student 1, check to ensure values where updated.
		response = this.rest.getForEntity(url, String.class);
		student = g.fromJson(response.getBody(), Student.class);
		assertThat(student.getId()).isEqualTo(1);
		assertThat(student.getAge()).isEqualTo(30);
		assertThat(student.getGrade()).isEqualTo("B");
		assertThat(student.getName()).isEqualTo("John Smith");		
	}
	
	@Test
	public void AddAndDeleteStudentTest() throws Exception
	{
		Gson g = new Gson();
		
		// Add a new student
		String url = "http://localhost:" + port + "/api/students";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		String requestJSON = "{\"name\":\"New Student\",\"grade\":\"D+\",\"age\":18}";
		HttpEntity<String> entity = new HttpEntity<String>(requestJSON, headers);
		rest.postForObject(url, entity, Student.class);
		
		// Ensure there are now two students, and ID 2 is the new one.
		
		// Check Student 2
		url = "http://localhost:" + port + "/api/students/2";
		ResponseEntity<String> response = this.rest.getForEntity(url, String.class);
		Student student = g.fromJson(response.getBody(), Student.class);
		assertThat(student.getId()).isEqualTo(2);
		assertThat(student.getAge()).isEqualTo(18);
		assertThat(student.getGrade()).isEqualTo("D+");
		assertThat(student.getName()).isEqualTo("New Student");
		
		// Check Student 1
		url = "http://localhost:" + port + "/api/students/1";
		response = this.rest.getForEntity(url, String.class);
		student = g.fromJson(response.getBody(), Student.class);
		assertThat(student.getId()).isEqualTo(1);
		assertThat(student.getAge()).isEqualTo(30);
		assertThat(student.getGrade()).isEqualTo("B");
		assertThat(student.getName()).isEqualTo("John Smith");			
		
		// Check that there are two students
		url = "http://localhost:" + port + "/api/students";
		response = this.rest.getForEntity(url, String.class);
		Student[] students = g.fromJson(response.getBody(), Student[].class);
		assertThat(students.length).isEqualTo(2);		
		
		// Text Deletion, remove new student
		url = "http://localhost:" + port + "/api/students/2";
		this.rest.delete(url);
		
		// Check Student 1 again, ensure it's our default 1. And that it's the only student.
		url = "http://localhost:" + port + "/api/students/1";
		response = this.rest.getForEntity(url, String.class);
		student = g.fromJson(response.getBody(), Student.class);
		assertThat(student.getId()).isEqualTo(1);
		assertThat(student.getAge()).isEqualTo(30);
		assertThat(student.getGrade()).isEqualTo("B");
		assertThat(student.getName()).isEqualTo("John Smith");	
		
		// Check that there is only one student
		url = "http://localhost:" + port + "/api/students";
		response = this.rest.getForEntity(url, String.class);
		students = g.fromJson(response.getBody(), Student[].class);
		assertThat(students.length).isEqualTo(1);		
	}
	 
}
