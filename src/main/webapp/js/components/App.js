/*
    App
    - General app to load/update in Students.
    - Contains a CreateView to allow automatic server updates, to avoid trigging page refreshes.
*/
window.App = React.createClass({

  // Load Students From Database REST - GET  
  loadStudents() {
    var self = this;
    $.ajax({
        url: "/api/students",
        type: 'GET'       
      }).then(function(data) {
        self.setState({ students: data });
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
            <StudentTable refresh={this.loadStudents} students={this.state.students} />   
            <CreateStudentView refresh={this.loadStudents} />
        </div>
    );
  }
});

// Root Render
ReactDOM.render(<App />, document.getElementById('main') );