# StudentCodeSample

This is a Sample Code Project to demonstrate a basic CRUD application with JavaScript [React](https://reactjs.org/) on the front-end and Java ([Spring](https://spring.io/)) on the back-end. This application was made to be cloned and easily executed without having to setup any additional dependencies (*ex: Node.JS*).

<h2>Setup and Running the Application</h2>

This example will be using an Eclipse IDE to walk-through loading and running this project, any other IDE with Maven support will also work.


**1.** Clone or download this repository:

<code>git clone https://github.com/SpencerWie/StudentCodeSample</code>
 

**2.** Select *`File --> Import...`*, then pick the option *`Maven --> Existing Maven Projects`*. Click *Next*.

<img src="imgs/ImportMaven.PNG" />

**3.** Browse to the root directory that this repository was cloned to:

<img src="imgs/ImportMaven_Root.PNG" />

**4.** If needed resolve the name template, and then check the `pom.xml` file. Click *Finnish*.

<img src="imgs/ImportMaven_pom.PNG" />

**5.** Once the project loads into the Editor simply run the Application. Then open a web broswer and input the URL `http://localhost:8080/` (*Or the port initiated by Tomcat*). 

<img src="imgs/AppRun.PNG">

<h2>SQL Server DataBase Configuration</h2>

This application will automiacally create and H2 Database when executed, that way no inital Database setup is needed. Setting up a Database with SQL Server is simple, uncomment the pre-defined items in the `application.properties`. These settings are the ones by the developer for their SQL Server Database:

>spring.jpa.hibernate.ddl-auto = *create-drop* 
>spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver
>spring.datasource.url=jdbc:sqlserver://localhost;DatabaseName=**student_db**;integratedSecurity=false;
>spring.datasource.username=**sa**  
>spring.datasource.password=**password**  

In the settings above replace `student_db` with the name of your database, then change the username `sa` and password `password` to a user which has access do that database. The option `create-drop` can also be changed if needed.

Below is an example of the application and Database with the settings above:

<img src="imgs/SQLServer.PNG" />
 
 <h2>Students CRUD</h2>
 
 <h4>Creating a New Student</h4>
 
 Click the item below the table called *"+ Create new student"*, then fillout the form information and click *"Create"*:
 
 <img src="/imgs/CRUD_Create_1.PNG" />

The new student will appear at the bottom of the list automatically, and the form will be set back to it's default values. There are basic HTML5 validations to prevent blank fields.

<img src="/imgs/CRUD_Create_2.PNG" />

<h4>Editing a Student</h4>

Clicking the button with a pencil icon in any row will toggle that row to be editable, and the buttons change to a confirm edit and cancel edit and repectively have tooltips *"Confirm Edit"* and *"Cancel Edit"*. If we give a blank value for *Name* and change Grade to *B+*, if we click on *Confirm Edit* a red border is shown on the blank field indicating the valid is invalid:

<img src="/imgs/CRUD_Create_3.PNG" />

Then clicking on *Cancel Edit* changes that row back to it's default view, and no changes are made. If we click on *Edit* on the row for "John Smith" and change the values to "Bob Smith", "40", and "C+" respectively and click *Confirm Edit* the view updates to those new values:

<img src="imgs/CRUD_Create_4.PNG" />
<img src="imgs/CRUD_Create_5.PNG" />




