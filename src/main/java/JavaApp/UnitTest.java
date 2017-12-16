package JavaApp;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.google.gson.Gson;

import com.sun.mail.iap.Response;

import static org.assertj.core.api.Assertions.assertThat;

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
		ResponseEntity<String> response = this.rest.exchange(url, HttpMethod.GET, null, String.class);
		
		Student[] students = g.fromJson(response.getBody(), Student[].class);
		
		assertThat(students.length).isEqualTo(1);
		if(students.length > 0)
		{
			Student student = students[0];
			assertThat(student.getId()).isEqualTo(1);
			assertThat(student.getAge()).isEqualTo(30);
			assertThat(student.getName()).isEqualTo("John Smith");
		}
		
		// Check that api/students/1 {GET} returns default student
		url = "http://localhost:" + port + "/api/students/1";
		response = this.rest.exchange(url, HttpMethod.GET, null, String.class);
		Student student = g.fromJson(response.getBody(), Student.class);
		assertThat(student.getName()).isEqualTo("John Smith");
	}
	
	// Test to edit initial student to new values.
	@Test 
	public void EditStudentTest() throws Exception
	{
		Gson g = new Gson();
		String url = "http://localhost:" + port + "/api/students/1";

	}
	 
}
