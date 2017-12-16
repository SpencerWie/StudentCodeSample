package JavaApp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner 
{

    private final StudentRepository repository;
    
    @Autowired
    public DatabaseLoader(StudentRepository repository) 
    {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception 
    {
    	// Load Database with a single default student
        this.repository.save(new Student("John Smith", "B", 30));
    }   
}
