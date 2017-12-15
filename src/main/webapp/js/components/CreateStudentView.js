/*
    CreateStudentView
    - Display for Create Form and handles create request
*/

window.CreateStudentView = React.createClass({

  // Do basic validation and field clears, then call create.
  handleCreate(e) {
    e.preventDefault();
    
    var newStudent = {};
    newStudent.name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    newStudent.age = ReactDOM.findDOMNode(this.refs.age).value.trim();
    newStudent.grade = ReactDOM.findDOMNode(this.refs.grade).value.trim();
    
    if(newStudent.name == "" || newStudent.age == "" || newStudent.grade == "") 
        return false;
        
    this.callCreate(newStudent);

    ReactDOM.findDOMNode(this.refs.name).value = '';
    ReactDOM.findDOMNode(this.refs.age).value = '';
    ReactDOM.findDOMNode(this.refs.grade).value = 'A+';
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
                        <label for="grade">Avg Grade</label>
                        <select ref="grade" type="number" className="form-control">
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="D-">D-</option>
                            <option value="F">F</option>
                        </select>
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