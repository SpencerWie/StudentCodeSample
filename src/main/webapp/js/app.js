/*
    Student
    - Record Displayed on Student Table. Can be deleted and updated.
*/
var Student = React.createClass({

  getInitialState: function() {
    return {display: true };
  },
  
  // Deletes the element from the Database by calling REST - DELETE
  handleDelete() {
    var self = this;
    if(window.confirm("Are you sure you want to delete this student?")) {
        $.ajax({
            // DELETE --> /api/students/{id}
            url: self.props.student._links.self.href, 
            type: 'DELETE',
            success: function(result) {
              self.setState({display: false});
            },
            error: function(xhr, ajaxOptions, thrownError) {
              toastr.error(xhr.responseJSON.message);
            }
        });
    }
  },
  
  // Triggers a state change to change to an Edit View
  updateView() {
    this.setState({update: true});        
  },
  
  // If the user cancels an update change input validations back to default and refresh.
  cancelUpdate() {
    this.state.update = false; 
    
    var group_NameNode = ReactDOM.findDOMNode(this.refs.newNameGroup);
    var group_AgeNode = ReactDOM.findDOMNode(this.refs.newAgeGroup);
    if(group_NameNode != null) group_NameNode.className = "form-group";
    if(group_AgeNode != null) group_AgeNode.className = "form-group";
    
    this.forceUpdate();
  },
  
  // Modifies the element in the Database by calling REST - PUT
  handleUpdate() {
  
    var newStudent = {};
    
    var nameNode = ReactDOM.findDOMNode(this.refs.newName);
    var ageNode = ReactDOM.findDOMNode(this.refs.newAge);
    var group_NameNode = ReactDOM.findDOMNode(this.refs.newNameGroup);
    var group_AgeNode = ReactDOM.findDOMNode(this.refs.newAgeGroup);
    
    newStudent.name = nameNode.value.trim();
    newStudent.age = ageNode.value.trim();      
    
    group_NameNode.className = "form-group has-success has-feedback";
    group_AgeNode.className = "form-group has-success has-feedback";
    
    if(nameNode.value.trim() == ""){ 
        group_NameNode.className = "form-group has-error has-feedback";
        return false;
    }
    if(ageNode.value.trim() == "") { 
        group_AgeNode.className = "form-group has-error has-feedback";
        return false;
    }     
    
    var self = this;
    $.ajax({
        // PUT --> /api/students/{id} (note: PUT is used because this should be idempotent)
        url: self.props.student._links.self.href,
        type: 'PUT',        
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(newStudent),
        success: function(result) {
            self.props.student.name = newStudent.name;
            self.props.student.age = newStudent.age;
            self.setState({update: false});
        },
        error: function(xhr, ajaxOptions, thrownError) {
          toastr.error(xhr.responseJSON.message);
        }
    });    
  },
  
  // Renders the record for View or Update depending on the state
  render() {
    var self = this;
    var viewRecordStudent = (
           <tr>
              <td>{this.props.student.name}</td>
              <td>{this.props.student.age}</td>
              <td>
                <button className="btn btn-primary" onClick={this.updateView}>
                    <span className="glyphicon glyphicon-pencil"></span>
                </button>
              </td>      
              <td>
                <button className="btn btn-danger" onClick={this.handleDelete}>
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
              </td> 
            </tr>         
    );
    if (this.state.update == true)
    {
       viewRecordStudent = (
           <tr className="form-horizontal">
              <td ref="newNameGroup" className="form-group">
                <input ref="newName" type="text" defaultValue={this.props.student.name} className="form-control" />
              </td>
              <td ref="newAgeGroup" class="form-group">
                <input ref="newAge" type="number" defaultValue={this.props.student.age} className="form-control" />
              </td>
              <td>
                <button className="btn btn-success" onClick={this.handleUpdate}>
                    <span className="glyphicon glyphicon-ok-circle" title="Confirm Edit" ></span>
                </button>  
              </td>      
              <td>
                <button className="btn btn-warning" onClick={this.cancelUpdate}>
                    <span className="glyphicon glyphicon-remove-circle" title="Cancel Edit"></span>
                </button>                  
              </td>
            </tr>            
        );       
    }

    if (this.state.display==false) return null; // On Delete don't render anything
    
    return viewRecordStudent;
  }
});

/*
    StudentTable
    - Structural Component to display a list of Students as a Table.
*/

var StudentTable = React.createClass({

  render() {
    var rows = [];
    this.props.students.forEach(function(student) {
      rows.push(<Student student={student} key={student.name} />);
    });

    return (
      <table className="table">
          <thead>
              <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Edit</th>
                  <th>Remove</th>
              </tr>
          </thead>
          <tbody>{rows}</tbody>
      </table>
    );
  }
});

/*
    CreateStudentView
    - Display for Create Form and handles create request
*/

var CreateStudentView = React.createClass({

  // Do basic validation and field clears, then call create.
  handleCreate(e) {
    e.preventDefault();
    
    var newStudent = {};
    newStudent.name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    newStudent.age = ReactDOM.findDOMNode(this.refs.age).value.trim();
    
    if(newStudent.name == "" || newStudent.age == "") 
        return false;
        
    this.callCreate(newStudent);

    ReactDOM.findDOMNode(this.refs.name).value = '';
    ReactDOM.findDOMNode(this.refs.age).value = '';
  },
  
  // Request for creating a new Student  
  callCreate(newStudent) {
    var self = this;
    $.ajax({
        // POST --> /api/students/ 
        url: '/api/students',
        type: 'POST',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(newStudent),
        success: function(result) {
            self.props.refresh();
        },
        error: function(xhr, ajaxOptions, thrownError) {
          toastr.error(xhr.responseJSON.message);
        }
    });
  },
  
  // Renders Creation Form
  render() {
    return (
        <div id="createStudent">
            <div className="well">
                <h4 id="newStudent"><span id="newStudentSign" className="glyphicon glyphicon-plus"></span> Create new student</h4>
                <form id="newStudentForm" ref="form" className="form" onSubmit={this.handleCreate}>
                    <div className="form-group ">
                        <label for="name">Name</label>
                        <input ref="name" required type="text" placeholder="Enter Name" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label for="name">Age</label>
                        <input ref="age" required type="number" min="0" placeholder="Enter Age" pattern="\d+" className="form-control" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
         </div>      
    );  
  }   
});

/*
    App
    - General app to load/update in Students.
    - Contains a CreateView to allow automatic server updates, to avoid trigging page refreshes.
*/
var App = React.createClass({

  // Load Students From Database REST - GET  
  loadStudents() {
    var self = this;
    $.ajax({
        url: "/api/students",
        type: 'GET'       
      }).then(function(data) {
        self.setState({ students: data._embedded.students });
      });
  },
  
  componentDidMount() {
    this.loadStudents();
  },  

  getInitialState() {
    return { students: [], attributes: [] };
  },
  
  handleCreate(e) {
    e.preventDefault();
    
    var newStudent = {};
    newStudent.name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    newStudent.age = ReactDOM.findDOMNode(this.refs.age).value.trim();
    
    if(newStudent.name == "" || newStudent.age == "") 
        return false;
        
    this.callCreate(newStudent);

    ReactDOM.findDOMNode(this.refs.name).value = '';
    ReactDOM.findDOMNode(this.refs.age).value = '';
  },
    
  callCreate(newStudent) {
    var self = this;
    $.ajax({
        url: '/api/students',
        type: 'POST',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(newStudent),
        success: function(result) {
            self.loadStudents();
        },
        error: function(xhr, ajaxOptions, thrownError) {
          toastr.error(xhr.responseJSON.message);
        }
    });
  },   
  
  render() {
    var self = this;
    
    var createForm = (
        <div id="createStudent">
            <div className="well">
                <h4 id="newStudent"><span id="newStudentSign" className="glyphicon glyphicon-plus"></span> Create new student</h4>
                <form id="newStudentForm" ref="form" className="form" onSubmit={this.handleCreate}>
                    <div className="form-group ">
                        <label for="name">Name</label>
                        <input ref="name" required type="text" placeholder="Enter Name" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label for="name">Age</label>
                        <input ref="age" required type="number" min="0" placeholder="Enter Age" pattern="\d+" className="form-control" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
         </div>  
    );      
    
    return (
        <div>
            <StudentTable students={this.state.students} />   
            <CreateStudentView refresh={this.loadStudents} />
        </div>
    );
  }
});

// Root Render
ReactDOM.render(<App />, document.getElementById('main') );