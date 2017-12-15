package JavaApp;

import java.util.Arrays;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Student {

	private @Id @GeneratedValue Long id;
	private String name;
	private String grade;
	private int age;

	@SuppressWarnings("unused")
	private Student() {}

	public Student(String name, String grade, int age) {
		this.setName(name);
		this.setGrade(grade);
		this.setAge(age);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		if(name != null && !name.isEmpty())
			this.name = name;
		else
			System.out.println("Name was not set, it cannot be null or empty");
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		if(age >= 0) 
		{
			this.age = age;
		}
		else
		{
			System.out.println("Age must be positive, defaulting to 0 ");
			this.age = 0;
		}
	}
	
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		String[] allowedGrades = {"A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"};
		if(Arrays.asList(allowedGrades).contains(grade)) {
			this.grade = grade;
		} else {
			System.out.println("Given grade is not recognized, defaulting to F.");
			this.grade = "F";
		}
	}

	public Long getId() {
		return this.id;
	}
}
